// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.

import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import {
  getDefaultSearchEngine,
  setDefaultSearchEngine,
  queryString,
} from 'src/utils'
import { Router } from '@angular/router'
import { searchEngineList } from 'src/store'
import { ISearchProps } from 'src/types'
import { SearchType } from './index'
import { $t } from 'src/locale'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzPopoverModule } from 'ng-zorro-antd/popover'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { LogoComponent } from 'src/components/logo/logo.component'
import { isLogin } from 'src/utils/user'

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
  selector: 'app-search',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class SearchComponent {
  @Input() size: 'small' | 'default' | 'large' = 'default'

  $t = $t
  searchEngineList: ISearchProps[] = searchEngineList.filter(
    (item) => !item.blocked
  )
  currentEngine: ISearchProps = getDefaultSearchEngine()
  SearchType = SearchType
  searchTypeValue = Number(queryString()['type']) || SearchType.All
  keyword = queryString().q
  isLogin = isLogin

  constructor(private router: Router) {}

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
    this.currentEngine = this.searchEngineList[index]
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
        _: Date.now(),
      },
    })
  }

  onKey(event: KeyboardEvent) {
    if (event.code === 'Enter') {
      this.triggerSearch()
    }
  }
}
