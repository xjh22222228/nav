// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, Input, ViewChild, ElementRef } from '@angular/core'
import type { IComponentItemProps } from 'src/types'
import { SafeHtmlPipe } from 'src/pipe/safeHtml.pipe'
import { parseHtmlWithContent, parseLoadingWithContent } from 'src/utils/utils'
import { component } from 'src/store'

@Component({
  standalone: true,
  imports: [SafeHtmlPipe],
  selector: 'app-html',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class HTMLComponent {
  @Input() data!: IComponentItemProps
  @ViewChild('root', { static: false }) root!: ElementRef

  private parseDescriptionTimer: any
  readonly component = component
  html = ''

  constructor() {}

  ngOnChanges() {
    this.init()
    this.parseDescription()
  }

  ngOnDestroy() {
    clearTimeout(this.parseDescriptionTimer)
  }

  private init() {
    this.html = parseLoadingWithContent(`!${this.data['html']}`)
  }

  private parseDescription() {
    clearTimeout(this.parseDescriptionTimer)
    this.parseDescriptionTimer = setTimeout(() => {
      parseHtmlWithContent(this.root?.nativeElement, `!${this.html}`)
    }, 300)
  }
}
