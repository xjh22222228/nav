// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, Input, ViewChild, ElementRef } from '@angular/core'
import { IComponentProps } from 'src/types'
import { SafeHtmlPipe } from 'src/pipe/safeHtml.pipe'
import { parseHtmlWithContent, parseLoadingWithContent } from 'src/utils/utils'

@Component({
  standalone: true,
  imports: [SafeHtmlPipe],
  selector: 'app-html',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class HTMLComponent {
  @Input() data!: IComponentProps
  @ViewChild('root', { static: false }) root!: ElementRef
  html = ''

  constructor() {}

  ngOnInit() {
    this.init()
  }

  ngOnChanges() {
    this.init()
  }

  private init() {
    this.html = parseLoadingWithContent(`!${this.data['html']}`)
  }

  ngAfterViewInit() {
    this.parseDescription()
  }

  private parseDescription() {
    parseHtmlWithContent(this.root?.nativeElement, `!${this.data['html']}`)
  }
}
