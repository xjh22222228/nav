// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { settings, components } from 'src/store'
import { ComponentType, IComponentProps } from 'src/types'

@Component({
  selector: 'component-group',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class ComponentGroupComponent {
  ComponentType = ComponentType
  components: IComponentProps[] = []

  constructor() {
    const c: IComponentProps[] = []
    // 按照系统设置顺序排序显示
    components.forEach((item) => {
      const has = settings.components.find(
        (c) => c.type === item.type && c.id === item.id
      )
      if (has) {
        c.push(has)
      }
    })
    this.components = c
  }

  trackByItem(i: number, item: any) {
    return item.id
  }
}
