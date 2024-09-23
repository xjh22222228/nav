// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { components, settings } from 'src/store'
import { ComponentType } from 'src/types'

@Component({
  selector: 'app-runtime',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class RuntimeComponent {
  runDays = 0

  constructor() {
    let now = Date.now() - settings.runtime
    now = now < 0 ? 0 : now
    this.runDays = Math.floor(now / (1000 * 60 * 60 * 24))
  }

  get data(): any {
    const data = components.find((item) => item.type === ComponentType.Runtime)
    return data || {}
  }
}
