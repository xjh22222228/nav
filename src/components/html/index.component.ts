// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, Input, ViewChild, ElementRef } from '@angular/core'
import { IComponentProps } from 'src/types'
import { SafeHtmlPipe } from 'src/pipe/safeHtml.pipe'
import { parseHtmlWithDescription } from 'src/utils/util'

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

  constructor() {}

  ngAfterViewInit() {
    this.parseDescription()
  }

  private parseDescription() {
    parseHtmlWithDescription(this.root?.nativeElement, `!${this.data['html']}`)
  }
}
