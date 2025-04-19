// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, Input, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'
import type { INavProps } from 'src/types'
import { NzDropDownModule } from 'ng-zorro-antd/dropdown'

@Component({
  standalone: true,
  imports: [CommonModule, NzDropDownModule],
  selector: 'app-web-more-menu',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class WebMoreMenuComponent {
  @Input() index = 0
  @Input() data: INavProps[] = []
  @Input() page = 0
  @Output() onClick = new EventEmitter()

  ngOnInit() {}

  handleCilck(id: number) {
    this.onClick?.emit?.(id)
  }
}
