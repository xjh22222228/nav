// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.

import config from '../../../../nav.config'
import { Component } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { INavProps, INavThreeProp } from '../../../types'
import {
  debounce,
  fuzzySearch,
  randomBgImg,
  queryString,
  setWebsiteList,
  toggleCollapseAll,
} from '../../../utils'
import { initRipple, setAnnotate } from '../../../utils/ripple'
import { websiteList } from '../../../store'

@Component({
  selector: 'app-home',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export default class HomeComponent {

  constructor (private router: Router, private activatedRoute: ActivatedRoute) {}

  websiteList: INavProps[] = websiteList
  currentList: INavThreeProp[] = []
  id: number = 0
  page: number = 0
  searchKeyword: string = ''
  showInput = false
  gitRepoUrl: string = config.gitRepoUrl

  ngOnInit() {
    randomBgImg()

    const initList = () => {
      try {
        if (this.websiteList[this.page] && this.websiteList[this.page]?.nav?.length > 0) {
          this.currentList = this.websiteList[this.page].nav[this.id].nav
        } else {
          this.currentList = []
        }
      } catch (error) {
        this.currentList = []
      }
    }

    this.activatedRoute.queryParams.subscribe(() => {
      const tempPage = this.page
      const { id, page, q } = queryString()
      this.searchKeyword = q
      this.page = page
      this.id = id

      if (q) {
        this.currentList = fuzzySearch(this.websiteList, q)
      } else {
        initList()
      }

      if (tempPage !== page) {
        setAnnotate()
      }

      setWebsiteList(this.websiteList)
    })

    this.handleSearch = debounce(() => {
      if (!this.searchKeyword) {
        initList()
        return
      }

      const params = queryString()
      this.router.navigate([this.router.url.split('?')[0]], {
        queryParams: {
          ...params,
          q: this.searchKeyword
        }
      })
    }, 1000, true)
  }

  collapsed() {
    try {
      return websiteList[this.page].nav[this.id].collapsed
    } catch (error) {
      return false
    }
  }

  onSearch(v) {
    this.searchKeyword = v
    this.handleSearch()
  }

  handleCilckTopNav(index) {
    const id = this.websiteList[index].id || 0
    this.router.navigate([this.router.url.split('?')[0]], {
      queryParams: {
        page: index,
        id,
        _: Date.now()
      }
    })
  }

  handleSidebarNav(index) {
    const { page } = queryString()
    this.websiteList[page].id = index
    this.router.navigate([this.router.url.split('?')[0]], { 
      queryParams: {
        page,
        id: index,
        _: Date.now()
      }
    })
  }

  ngAfterViewInit () {
    setAnnotate();
    initRipple()
  }

  onCollapse = (item, index) => {
    item.collapsed = !item.collapsed
    this.websiteList[this.page].nav[this.id].nav[index] = item
    setWebsiteList(this.websiteList)
  }

  onCollapseAll = () => {
    toggleCollapseAll(this.websiteList)
  }

  handleSearch = null
}
