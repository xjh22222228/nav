import { Component } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { INDEX_LANGUAGE, GIT_REPO_URL } from '../../../../config'
import { annotate } from 'rough-notation'
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

let equeue = []

@Component({
  selector: 'app-home',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export default class HomeComponent {

  constructor (private router: Router, private activatedRoute: ActivatedRoute) {}

  websiteList: any[] = getWebsiteList()
  currentList: any[] = []
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

  handleScroll(e) {
    const target = e.target
    const top = target.scrollTop;
    (<any>window).sessionStorage.top = top
  }

  handleCilckNav(index) {
    this.router.navigate(['/index'], {
      queryParams: {
        page: index,
        _: Date.now()
      }
    })
  }

  handleOnClickSearch() {
    this.showInput = true
    setTimeout(() => {
      try {
        (<any>document).querySelector('.search').focus()
      } catch (err) {}
    }, 0)
  }

  handleSidebarNav (index) {
    const { page } = queryString()
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
    try {
      document.getElementById('main').scrollTop = +(<any>window).sessionStorage.top || 0
    } catch (e) {}
  }

  setAnnotate() {
    const elList = document.querySelectorAll('.top-nav .ripple-btn') || []
    if (elList.length === 0) return

    equeue.forEach(item => item.hide())
    equeue = []

    const annotation = annotate(elList[this.page], {
      type: 'underline',
      color: 'red',
      padding: 3,
      strokeWidth: 3
    })
    equeue.push(annotation)
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
}
