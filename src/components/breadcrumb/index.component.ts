// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav
import { Component, ChangeDetectionStrategy, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import type { IWebProps } from 'src/types'

@Component({
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-breadcrumb',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class BreadcrumbComponent {
  @Input() data!: IWebProps

  constructor() {}
}
