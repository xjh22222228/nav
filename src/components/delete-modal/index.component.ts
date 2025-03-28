// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav
import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import type { IWebProps, INavProps } from 'src/types'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzModalModule } from 'ng-zorro-antd/modal'
import { NzMessageService } from 'ng-zorro-antd/message'
import event from 'src/utils/mitt'
import { $t } from 'src/locale'
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox'
import { deleteWebByIds, deleteClassByIds } from 'src/utils/web'

interface Props {
  ids: number[]
  data?: IWebProps | INavProps
  isClass?: boolean
  onOk?: () => void
  onComplete?: () => void
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
    NzButtonModule,
    NzCheckboxModule,
    FormsModule,
  ],
  selector: 'app-delete-modal',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class DeleteModalComponent {
  readonly $t = $t

  submitting = false
  showModal = false
  ids: number[] = []
  isClass = false
  data?: IWebProps | INavProps
  isChecked = false
  onOk?: () => void
  onComplete?: () => void

  constructor(private message: NzMessageService) {
    event.on('DELETE_MODAL', (props: unknown) => {
      const p = props as Props
      this.ids = p.ids
      this.isClass = p.isClass || false
      this.data = p.data
      this.showModal = true
      this.onOk = p.onOk
      this.onComplete = p.onComplete
    })
  }

  handleCancel() {
    this.showModal = false
    this.isChecked = false
  }

  async handleOk() {
    let isDelRid = false
    if (this.data?.rId && this.isChecked) {
      isDelRid = true
    }

    const ok = await (this.isClass
      ? deleteClassByIds(this.ids, isDelRid)
      : deleteWebByIds(this.ids, isDelRid))
    if (ok) {
      this.onOk?.()
      this.message.success($t('_delSuccess'))
    } else {
      this.message.error('Delete failed')
    }

    this.onComplete?.()
    this.handleCancel()
  }
}
