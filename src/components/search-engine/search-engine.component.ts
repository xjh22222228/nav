// 开源项目MIT，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息，允许商业途径。
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.

import { Component, Input } from '@angular/core'
import {
  getDefaultSearchEngine,
  setDefaultSearchEngine,
  queryString,
} from '../../utils'
import { Router } from '@angular/router'
import { searchEngineList } from 'src/store'
import { ISearchEngineProps } from '../../types'
import { SearchType } from './index'
import { $t } from 'src/locale'

@Component({
  selector: 'app-search-engine',
  templateUrl: './search-engine.component.html',
  styleUrls: ['./search-engine.component.scss'],
})
export class SearchEngineComponent {
  @Input() size: 'small' | 'default' | 'large' = 'default'

  $t = $t
  searchEngineList: ISearchEngineProps[] = searchEngineList
  currentEngine: ISearchEngineProps = getDefaultSearchEngine()
  SearchType = SearchType
  searchTypeValue = SearchType.All
  showEngine = false
  keyword = queryString().q

  constructor(private router: Router) {}

  inputFocus() {
    setTimeout(() => {
      document.getElementById('search-engine-input')?.focus?.()
    }, 100)
  }

  ngAfterViewInit() {
    this.inputFocus()

    document.addEventListener('click', () => {
      this.toggleEngine(undefined, false)
    })
  }

  toggleEngine(e?: Event, isShow?: boolean) {
    if (this.searchEngineList.length <= 1) return

    if (e) {
      e.stopPropagation()
    }
    this.showEngine = typeof isShow === 'undefined' ? !this.showEngine : isShow
  }

  clickEngineItem(index: number) {
    this.currentEngine = this.searchEngineList[index]
    this.toggleEngine()
    this.inputFocus()
    setDefaultSearchEngine(this.currentEngine)
  }

  triggerSearch() {
    if (this.currentEngine.url) {
      window.open(this.currentEngine.url + this.keyword)
      return
    }

    const params = queryString()
    this.router.navigate([this.router.url.split('?')[0]], {
      queryParams: {
        ...params,
        q: this.keyword,
        type: this.searchTypeValue,
      },
    })
  }

  onKey(event: KeyboardEvent) {
    if (event.code === 'Enter') {
      this.triggerSearch()
    }
  }
}
