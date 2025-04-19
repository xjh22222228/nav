// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
} from '@angular/forms'
import { CommonModule } from '@angular/common'
import { $t } from 'src/locale'
import { NzMessageService } from 'ng-zorro-antd/message'
import type { ISearchItemProps, ISearchProps } from 'src/types'
import { updateFileContent } from 'src/api'
import { NzModalService } from 'ng-zorro-antd/modal'
import { SEARCH_PATH } from 'src/constants'
import { search } from 'src/store'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzTableModule } from 'ng-zorro-antd/table'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzSwitchModule } from 'ng-zorro-antd/switch'
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm'
import { UploadComponent } from 'src/components/upload/index.component'
import { NzFormModule } from 'ng-zorro-antd/form'
import { NzSliderModule } from 'ng-zorro-antd/slider'
import { isSelfDevelop } from 'src/utils/utils'
import { isValidImg } from 'src/utils'

@Component({
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NzButtonModule,
    NzTableModule,
    NzInputModule,
    UploadComponent,
    NzSwitchModule,
    NzPopconfirmModule,
    NzFormModule,
    NzSliderModule,
  ],
  providers: [NzModalService, NzMessageService],
  selector: 'system-tag',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class SystemSearchComponent {
  readonly $t = $t
  readonly isSelfDevelop = isSelfDevelop
  searchList: ISearchItemProps[] = search.list
  submitting: boolean = false
  validateForm!: FormGroup

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalService
  ) {
    const group: any = {
      ...search,
      list: null,
    }
    const groupPayload: any = {}
    for (const k in group) {
      if (group[k] != null) {
        groupPayload[k] = [group[k]]
      }
    }
    this.validateForm = this.fb.group(groupPayload)
  }

  onLogoChange(data: any, key: string) {
    this.validateForm.get(key)?.setValue(data.cdn || '')
  }

  handleAdd() {
    const isEmpty = this.searchList.some((item) => !item.name.trim())
    if (isEmpty) {
      return
    }
    this.searchList.unshift({
      name: '',
      url: '',
      icon: '',
      placeholder: '',
      blocked: false,
      isInner: false,
    })
  }

  handleDelete(idx: number) {
    this.searchList.splice(idx, 1)
  }

  // 上移
  moveUp(index: number): void {
    if (index === 0) {
      return
    }
    const current = this.searchList[index]
    const prev = this.searchList[index - 1]
    this.searchList[index - 1] = current
    this.searchList[index] = prev
  }

  // 下移
  moveDown(index: number): void {
    if (index === this.searchList.length - 1) {
      return
    }
    const current = this.searchList[index]
    const next = this.searchList[index + 1]
    this.searchList[index + 1] = current
    this.searchList[index] = next
  }

  async handleSubmit() {
    if (this.submitting) {
      return
    }
    this.submitting = true
    const values = this.validateForm.value
    const promises = []
    if (values.logo) {
      promises.push(isValidImg(values.logo))
    }
    if (values.darkLogo) {
      promises.push(isValidImg(values.darkLogo))
    }
    const imgValues = await Promise.all(promises)

    for (const item of imgValues) {
      if (!item.valid) {
        this.message.error(`${$t('_errLogo')}: "${item.url}"`)
        this.submitting = false
        return
      }
    }
    this.submitting = false

    this.modal.info({
      nzTitle: $t('_syncDataOut'),
      nzOkText: $t('_confirmSync'),
      nzContent: $t('_confirmSyncTip'),
      nzOnOk: () => {
        this.submitting = true
        const params: ISearchProps = {
          ...values,
          list: this.searchList.filter((item) => item.name.trim()),
        }
        updateFileContent({
          message: 'update search',
          content: JSON.stringify(params),
          path: SEARCH_PATH,
        })
          .then(() => {
            this.message.success($t('_saveSuccess'))
          })
          .finally(() => {
            this.submitting = false
          })
      },
    })
  }

  onChangeUpload(path: any, idx: number) {
    this.searchList[idx].icon = path.cdn
  }
}
