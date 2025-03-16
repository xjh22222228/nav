// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, Input, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'
import type { INavThreeProp, INavProps } from 'src/types'
import { isLogin, getPermissions } from 'src/utils/user'
import { websiteList, settings } from 'src/store'
import { NzIconModule } from 'ng-zorro-antd/icon'
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm'
import { $t } from 'src/locale'
import { isSelfDevelop } from 'src/utils/utils'
import { CommonService } from 'src/services/common'
import event from 'src/utils/mitt'

@Component({
  standalone: true,
  imports: [CommonModule, NzIconModule, NzPopconfirmModule],
  selector: 'app-toolbar-title',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class ToolbarTitleWebComponent {
  @Input() dataSource!: INavThreeProp
  @Output() onCollapse = new EventEmitter()

  readonly $t = $t
  readonly isLogin = isLogin
  readonly websiteList: INavProps[] = websiteList
  readonly permissions = getPermissions(settings)

  constructor(public commonService: CommonService) {}

  openCreateWebModal() {
    event.emit('CREATE_WEB', {
      parentId: this.dataSource.id,
    })
  }

  openMoveModal(e: Event, data: INavThreeProp) {
    this.stopPropagation(e)
    event.emit('MOVE_WEB', {
      id: data.id,
      data: [data],
      level: 3,
    })
  }

  async handleDelete(e: Event, id: number) {
    this.stopPropagation(e)
    const ok = await this.commonService.deleteClassByIds([id], this.dataSource)
    if (ok) {
      if (!isSelfDevelop) {
        event.emit('WEB_REFRESH')
      }
    }
  }

  stopPropagation(e: Event) {
    e.stopPropagation()
    e.preventDefault()
  }

  handleEditName(e: Event, data: INavThreeProp) {
    this.stopPropagation(e)
    event.emit('EDIT_CLASS_OPEN', { ...data })
  }
}
