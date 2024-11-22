// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.

import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
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
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzPopoverModule } from 'ng-zorro-antd/popover'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { LogoComponent } from 'src/components/logo/logo.component'

@Component({
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NzInputModule,
    NzPopoverModule,
    LogoComponent,
    NzSelectModule,
  ],
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
  keyword = queryString().q

  constructor(private router: Router) {}

  get searchList() {
    return this.searchEngineList.filter((item) => !item.blocked)
  }

  inputFocus() {
    setTimeout(() => {
      document.getElementById('search-engine-input')?.focus?.()
    }, 100)
  }

  ngAfterViewInit() {
    this.inputFocus()
  }

  clickEngineItem(index: number) {
    document.body.click()
    this.currentEngine = this.searchList[index]
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
