// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, Input, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'
import { INavThreeProp, INavProps } from 'src/types'
import { isLogin, getPermissions } from 'src/utils/user'
import { websiteList, settings } from 'src/store'
import { NzIconModule } from 'ng-zorro-antd/icon'
import event from 'src/utils/mitt'

@Component({
  standalone: true,
  imports: [CommonModule, NzIconModule],
  selector: 'app-toolbar-title',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class ToolbarTitleWebComponent {
  @Input() dataSource!: INavThreeProp
  @Output() onCollapse = new EventEmitter()

  readonly isLogin = isLogin
  readonly websiteList: INavProps[] = websiteList
  readonly permissions = getPermissions(settings)

  constructor() {}

  openCreateWebModal() {
    event.emit('CREATE_WEB', {
      parentId: this.dataSource.id,
    })
  }

  handleEditName(e: Event, data: INavThreeProp) {
    e.stopPropagation()
    e.preventDefault()
    event.emit('EDIT_CLASS_OPEN', { ...data })
  }
}
