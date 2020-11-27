import { Component } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { INDEX_LANGUAGE, GIT_REPO_URL } from '../../../../config'
import { annotate } from 'rough-notation'
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
} from '../../../utils'

let ANNOTATE_EQUEUE = []

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
  searchLoading = false
  language: string[] = INDEX_LANGUAGE
  GIT_REPO_URL: string = GIT_REPO_URL

  ngOnInit () {
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
        this.searchLoading = false
      } else {
        initList()
      }

      if (tempPage !== page) {
        this.setAnnotate()
      }

      setWebsiteList(this.websiteList)
    })

    this.handleSearch = debounce(() => {
      if (!this.searchKeyword) {
        initList()
        this.searchLoading = false
        return
      }

      const params = queryString()
      this.router.navigate(['/index'], {
        queryParams: {
          ...params,
          q: this.searchKeyword
        }
      })

      this.searchLoading = true
    }, 1000, false)
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
    this.router.navigate(['/index'], {
      queryParams: {
        page: index,
        id,
        _: Date.now()
      }
    })
  }

  handleSidebarNav (index) {
    const { page } = queryString()
    this.websiteList[page].id = index
    this.router.navigate(['/index'], { 
      queryParams: {
        page,
        id: index,
        _: Date.now()
      }
    })
  }

  ngAfterViewInit () {
    this.setAnnotate();

    (<any>window).$.ripple('.ripple-btn', {
      multi: true,
      debug: false,
      opacity: .2,
    })
  }

  setAnnotate() {
    const elList = document.querySelectorAll('.top-nav .ripple-btn') || []
    if (elList.length === 0) return

    ANNOTATE_EQUEUE.forEach(item => item.hide())
    ANNOTATE_EQUEUE = []

    const annotation = annotate(elList[this.page], {
      type: 'underline',
      color: 'red',
      padding: 3,
      strokeWidth: 3
    })
    ANNOTATE_EQUEUE.push(annotation)
    annotation.show()
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

  onSideLogoError(e) {
    const el = e.currentTarget;
    if (el) {
      el?.parentNode?.removeChild(el)
    }
  }
}
