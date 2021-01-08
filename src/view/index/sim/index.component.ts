import { Component } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import config from '../../../../nav.config'
import { INavProps, INavThreeProp } from '../../../types'
import {
  debounce,
  fuzzySearch,
  onImgError,
  queryString,
  getWebsiteList,
  setWebsiteList,
  toggleCollapseAll,
  totalWeb,
  imgErrorInRemove
} from '../../../utils'
import { initRipple, setAnnotate } from '../../../utils/ripple'

const { gitRepoUrl, title, posterImageUrl } = config
let sidebarEl: HTMLElement;

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
  gitRepoUrl: string = gitRepoUrl
  totalWeb: number = totalWeb()
  title: string = title
  posterImageUrl: string = posterImageUrl

  ngOnInit() {
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

      this.currentList = fuzzySearch(this.websiteList, this.searchKeyword)

      const params = queryString()
      this.router.navigate(['/sim'], {
        queryParams: {
          ...params,
          q: this.searchKeyword
        }
      })
    }, 1000, true)
  }

  onScroll() {
    const y = window.scrollY
    if (!sidebarEl) {
      sidebarEl = document.getElementById('sidebar')
    }

    if (y >= 438) {
      sidebarEl.classList.add('fix')
    } else {
      sidebarEl.classList.remove('fix')
    }
  }

  ngOnDestroy() {
    window.removeEventListener('scroll',  this.onScroll)
  }

  ngAfterViewInit () {
    initRipple()
    setAnnotate();

    window.addEventListener('scroll', this.onScroll)
  }

  handleSidebarNav(index) {
    const { page } = queryString()
    this.websiteList[page].id = index
    this.router.navigate(['/sim'], { 
      queryParams: {
        page,
        id: index,
        _: Date.now()
      }
    })
  }

  handleCilckTopNav(idx) {
    const id = this.websiteList[idx].id || 0
    this.router.navigate(['/sim'], {
      queryParams: {
        page: idx,
        id,
        _: Date.now()
      }
    })
  }

  onCollapse = (item, index) => {
    item.collapsed = !item.collapsed
    this.websiteList[this.page].nav[this.id].nav[index] = item
    setWebsiteList(this.websiteList)
  }

  onCollapseAll = () => {
    toggleCollapseAll(this.websiteList)
  }

  onSearch(v) {
    this.searchKeyword = v
    this.handleSearch()
  }

  handleSearch = null
  onImgError = onImgError
  onSideLogoError = imgErrorInRemove
}
