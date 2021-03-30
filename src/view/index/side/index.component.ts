// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import config from '../../../../nav.config'
import { Component } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { INavProps, INavThreeProp, ISearchEngineProps } from '../../../types'
import {
  fuzzySearch,
  queryString,
  setWebsiteList,
  toggleCollapseAll,
} from '../../../utils'
import { websiteList } from '../../../store'
import { LOGO_CDN } from '../../../constants'
import * as s from '../../../../data/search.json'

const searchEngineList: ISearchEngineProps[] = (s as any).default

@Component({
  selector: 'app-home',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export default class HomeComponent {
  LOGO_CDN = LOGO_CDN
  websiteList: INavProps[] = websiteList
  currentList: INavThreeProp[] = []
  id: number = 0
  page: number = 0
  title: string = config.title.trim().split(/\s/)[0]
  openIndex = queryString().page
  contentEl: HTMLElement
  searchEngineList = searchEngineList
  marginTop: number = 70

  constructor (private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
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
      const { id, page, q } = queryString()
      this.page = page
      this.id = id

      if (q) {
        this.currentList = fuzzySearch(this.websiteList, q)
      } else {
        initList()
      }

      setWebsiteList(this.websiteList)
    })
  }

  ngAfterContentInit() {
    window.addEventListener('scroll', this.scroll)

    setTimeout(() => {
      const headerEl = document.querySelector('.search-header')
      this.marginTop = headerEl.clientHeight + 10
    }, 26)
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll)
  }

  scroll() {
    const y = window.scrollY
    if (!this.contentEl) {
      this.contentEl = document.getElementById('content')
    }
    if (y > 30) {
      this.contentEl.classList.add('fixed')
    } else {
      this.contentEl.classList.remove('fixed')
    }
  }

  handleSidebarNav(page, id) {
    this.websiteList[page].id = id
    this.router.navigate([this.router.url.split('?')[0]], { 
      queryParams: {
        page,
        id,
      }
    })
    window.scrollTo(0, 0)
  }

  onCollapse = (item, index) => {
    item.collapsed = !item.collapsed
    this.websiteList[this.page].nav[this.id].nav[index] = item
    setWebsiteList(this.websiteList)
  }

  onCollapseAll = () => {
    toggleCollapseAll(this.websiteList)
  }

  collapsed() {
    try {
      return websiteList[this.page].nav[this.id].collapsed
    } catch (error) {
      return false
    }
  }
}
