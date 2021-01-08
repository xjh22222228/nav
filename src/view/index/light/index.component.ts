import { Component } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import config from '../../../../nav.config'
import { INavProps, INavThreeProp } from '../../../types'
import {
  debounce,
  fuzzySearch,
  randomBgImg,
  onImgError,
  queryString,
  getWebsiteList,
  setWebsiteList,
  toggleCollapseAll,
  imgErrorInRemove
} from '../../../utils'
import { initRipple, setAnnotate } from '../../../utils/ripple'

@Component({
  selector: 'app-home',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export default class HomeComponent {

  constructor (private router: Router, private activatedRoute: ActivatedRoute) {}

  websiteList: INavProps[] = getWebsiteList()
  currentList: INavThreeProp[] = []
  id: number = 0
  page: number = 0
  searchKeyword: string = ''
  showInput = false
  gitRepoUrl: string = config.gitRepoUrl

  ngOnInit() {
    randomBgImg()

    const initList = () => {
      this.currentList = this.websiteList[this.page].nav[this.id].nav
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
      this.router.navigate(['/light'], {
        queryParams: {
          ...params,
          q: this.searchKeyword
        }
      })
    }, 1000, true)
  }

  onSearch(v) {
    this.searchKeyword = v
    this.handleSearch()
  }

  handleOnClickSearch() {
    this.showInput = true
    setTimeout(() => {
      const searchEl = document.querySelector('.search') as HTMLInputElement
      if (searchEl) {
        searchEl.focus()
      }
    }, 0)
  }

  handleCilckTopNav(index) {
    const id = this.websiteList[index].id || 0
    this.router.navigate(['/light'], {
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
    this.router.navigate(['/light'], { 
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
  onImgError = onImgError
  onSideLogoError = imgErrorInRemove
}
