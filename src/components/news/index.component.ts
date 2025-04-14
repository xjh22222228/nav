// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  ViewChildren,
  QueryList,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import type { IComponentProps } from 'src/types'
import { newsTypeMap } from './types'
import { getNews } from 'src/api'
import { JumpService } from 'src/services/jump'
import { STORAGE_KEY_MAP } from 'src/constants'
import { $t } from 'src/locale'
import { NewsType } from 'src/types'
import { scrollIntoView } from 'src/utils'
import { LoadingComponent } from 'src/components/loading/index.component'

interface INewsItem {
  text: string
  url: string
  hot: string
  type: NewsType
}

@Component({
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  selector: 'app-news',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class NewsComponent {
  @ViewChild('parent') parentElement!: ElementRef
  @ViewChildren('item') items!: QueryList<ElementRef>
  @Input() data!: IComponentProps

  readonly $t = $t
  readonly newsTypeMap = newsTypeMap
  activeIndex = 0
  newsListMap: Record<string, INewsItem[]> = {}
  loading = false

  constructor(public readonly jumpService: JumpService) {
    const newsListMap = localStorage.getItem(STORAGE_KEY_MAP.NEWS)
    if (newsListMap) {
      try {
        this.newsListMap = JSON.parse(newsListMap)
      } catch {}
    }
  }

  get newsList() {
    const types = this.data['types'] as NewsType[]
    return this.newsListMap[types[this.activeIndex]] || []
  }

  ngOnChanges() {
    this.getNews()
  }

  onMouseEnter(index: number) {
    this.activeIndex = index
    this.scrollIntoViewTabs()
  }

  private scrollIntoViewTabs() {
    scrollIntoView(
      this.parentElement.nativeElement,
      this.items.toArray()[this.activeIndex].nativeElement,
      {
        behavior: 'smooth',
      }
    )
  }

  private getNews() {
    const types = this.data['types'] as NewsType[]
    if (!types || types.length <= 0) {
      localStorage.removeItem(STORAGE_KEY_MAP.NEWS)
      localStorage.removeItem(STORAGE_KEY_MAP.NEWS_DATE)
      return
    }

    const now = Date.now()
    const newsDate = Number(localStorage.getItem(STORAGE_KEY_MAP.NEWS_DATE))
    // 1小时更新一次
    if (newsDate && now - newsDate < 3600000) {
      return
    }

    if (this.newsList.length <= 0) {
      this.loading = true
    }

    getNews({ ...this.data })
      .then((res) => {
        this.newsListMap = {
          ...this.newsListMap,
          ...res.data,
        }
        localStorage.setItem(
          STORAGE_KEY_MAP.NEWS,
          JSON.stringify(this.newsListMap)
        )
        localStorage.setItem(
          STORAGE_KEY_MAP.NEWS_DATE,
          JSON.stringify(Date.now())
        )
      })
      .finally(() => {
        this.loading = false
      })
  }

  trackByItem(a: any, item: INewsItem) {
    return item.text
  }
}
