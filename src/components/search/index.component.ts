// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.

import { Component, Input, ViewChild, ElementRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import {
  getDefaultSearchEngine,
  setDefaultSearchEngine,
  queryString,
} from 'src/utils'
import { Router, ActivatedRoute } from '@angular/router'
import { searchEngineList } from 'src/store'
import type { ISearchProps } from 'src/types'
import { SearchType } from './index'
import { $t } from 'src/locale'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzPopoverModule } from 'ng-zorro-antd/popover'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { LogoComponent } from 'src/components/logo/logo.component'
import { isLogin } from 'src/utils/user'
import event from 'src/utils/mitt'

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
  @ViewChild('input', { static: false }) input!: ElementRef
  @Input() size: 'small' | 'default' | 'large' = 'default'

  readonly $t = $t
  readonly isLogin = isLogin
  readonly SearchType = SearchType
  readonly searchEngineList: ISearchProps[] = searchEngineList.filter(
    (item) => !item.blocked
  )
  currentEngine: ISearchProps = getDefaultSearchEngine()
  searchTypeValue = Number(queryString()['type']) || SearchType.All
  keyword = queryString().q

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    event.on('SEARCH_FOCUS', () => {
      this.inputFocus()
    })
    if (!this.isLogin && this.searchTypeValue === SearchType.Id) {
      this.searchTypeValue = SearchType.All
    }
  }

  private inputFocus() {
    setTimeout(() => {
      this.input?.nativeElement?.focus()
    }, 100)
  }

  ngAfterViewInit() {
    this.inputFocus()
  }

  onSelectChange() {
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
      if (this.currentEngine.url.includes('${q}')) {
        window.open(this.currentEngine.url.replaceAll('${q}', this.keyword))
      } else {
        window.open(this.currentEngine.url + this.keyword)
      }

      return
    }

    const params = queryString()
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
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
