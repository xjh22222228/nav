// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav
import { Component, Input, EventEmitter, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import type { IWebTag } from 'src/types'
import { tagMap, settings } from 'src/store'
import { JumpService } from 'src/services/jump'
import { isLogin, getPermissions } from 'src/utils/user'
import { NzIconModule } from 'ng-zorro-antd/icon'
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm'
import { $t } from 'src/locale'

@Component({
  standalone: true,
  imports: [CommonModule, NzIconModule, NzPopconfirmModule],
  selector: 'tag-list',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class TagListComponent {
  @Input() data?: IWebTag[] | undefined = []
  @Input() action: boolean = false
  @Output() onDelete = new EventEmitter<void>()
  @Output() onMove = new EventEmitter<void>()
  @Output() onEdit = new EventEmitter<void>()

  readonly $t = $t
  readonly isLogin = isLogin
  readonly tagMap = tagMap
  readonly permissions = getPermissions(settings)

  constructor(public jumpService: JumpService) {}

  private handleClick(e: any) {
    e.stopPropagation()
    e.preventDefault()
  }

  openEditWebMoal(e: any) {
    this.handleClick(e)
    this.onEdit.emit()
  }

  confirmDel(e: any) {
    this.handleClick(e)
    this.onDelete.emit()
  }

  openMoveWebModal(e: any) {
    this.handleClick(e)
    this.onMove.emit()
  }
}
