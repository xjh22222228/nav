// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, ChangeDetectionStrategy } from '@angular/core'
import { settings } from 'src/store'
import { ComponentType } from 'src/types'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'component-group',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class ComponentGroupComponent {
  settings = settings
  ComponentType = ComponentType

  constructor() {}
}
