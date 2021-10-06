// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.

import hotkeys from 'hotkeys-js'
import { Component } from '@angular/core'
import { getDefaultSearchEngine, setDefaultSearchEngine, queryString } from '../../utils'
import { Router } from '@angular/router'
import * as searchEngineList from '../../../data/search.json'
import { ISearchEngineProps } from '../../types'
import { SearchType } from './index'
import { $t } from 'src/locale'

@Component({
  selector: 'app-search-engine',
  templateUrl: './search-engine.component.html',
  styleUrls: ['./search-engine.component.scss']
})
export class SearchEngineComponent {
  $t = $t
  searchEngineList: ISearchEngineProps[] = (searchEngineList as any).default
  currentEngine: ISearchEngineProps = getDefaultSearchEngine()
  SearchType = SearchType
  searchTypeValue = SearchType.All
  showEngine = false
  keyword = queryString().q

  constructor (private router: Router) {}

  inputFocus() {
    setTimeout(() => {
      document.getElementById('search-engine-input')?.focus?.()
    }, 100)
  }

  ngAfterViewInit() {
    this.inputFocus()

    document.addEventListener('click', () => {
      this.toggleEngine(null, false)
    })

    hotkeys('enter', () => {
      this.inputFocus()
    })
  }

  ngOnDestroy() {
    hotkeys.unbind()
  }

  toggleEngine(e?: Event, isShow?: boolean) {
    if (this.searchEngineList.length <= 1) return

    if (e) {
      e.stopPropagation()
    }
    this.showEngine = typeof isShow === 'undefined'
      ? !this.showEngine
      : isShow
  }

  clickEngineItem(index) {
    this.currentEngine = this.searchEngineList[index]
    this.toggleEngine()
    this.inputFocus()
    setDefaultSearchEngine(this.currentEngine)
  }

  triggerSearch() {
    if (this.currentEngine.url) {
      window.open(this.currentEngine.url + this.keyword)
    }
    
    const params = queryString()
    this.router.navigate([this.router.url.split('?')[0]], {
      queryParams: {
        ...params,
        q: this.keyword,
        type: this.searchTypeValue
      }
    })
  }

  onKey(event: KeyboardEvent) {
    if (event.code === 'Enter') {
      this.triggerSearch()
    }
  }
}
