// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, Input, ViewChild, ElementRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import type { ImageProps } from 'src/types'
import { parseHtmlWithContent, parseLoadingWithContent } from 'src/utils/utils'
import { SafeHtmlPipe } from 'src/pipe/safeHtml.pipe'
import { CODE_SYMBOL } from 'src/constants/symbol'

@Component({
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  selector: 'app-swiper-item',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class SwiperItemComponent {
  @Input() data: ImageProps = {} as ImageProps
  @Input() height!: number
  @ViewChild('root', { static: false }) root!: ElementRef

  isCode = false
  html = ''

  constructor() {}

  ngOnInit() {
    this.isCode = this.data.url[0] === CODE_SYMBOL
    if (this.isCode) {
      this.html = parseLoadingWithContent(this.data.url)
    }
  }

  ngAfterViewInit() {
    this.parseDescription()
  }

  private parseDescription() {
    if (this.isCode) {
      parseHtmlWithContent(this.root?.nativeElement, this.data.url)
    }
  }
}
