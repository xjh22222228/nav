// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, EventEmitter, Output } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { $t } from 'src/locale'
import { FormBuilder, FormGroup } from '@angular/forms'
import { NzDrawerModule } from 'ng-zorro-antd/drawer'
import { NzFormModule } from 'ng-zorro-antd/form'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzSliderModule } from 'ng-zorro-antd/slider'
import { NzColorPickerModule } from 'ng-zorro-antd/color-picker'
import { NzCheckboxModule, NzCheckboxOption } from 'ng-zorro-antd/checkbox'
import { newsTypeMap } from '../types'
import { NewsType } from 'src/types'
import { STORAGE_KEY_MAP } from 'src/constants'

@Component({
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NzDrawerModule,
    NzFormModule,
    NzButtonModule,
    NzInputModule,
    NzSliderModule,
    NzColorPickerModule,
    NzCheckboxModule,
  ],
  selector: 'news-drawer',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class NewsDrawerComponent {
  @Output() ok = new EventEmitter<void>()

  readonly $t = $t
  visible = false
  validateForm!: FormGroup
  index = 0
  options: NzCheckboxOption[] = [
    { label: newsTypeMap[NewsType.Baidu], value: NewsType.Baidu },
    { label: newsTypeMap[NewsType.Bilibili], value: NewsType.Bilibili },
    { label: newsTypeMap[NewsType.Douyin], value: NewsType.Douyin },
    { label: newsTypeMap[NewsType.Juejin], value: NewsType.Juejin },
    { label: newsTypeMap[NewsType.V2ex], value: NewsType.V2ex },
    { label: newsTypeMap[NewsType.Weibo], value: NewsType.Weibo },
    { label: newsTypeMap[NewsType.GitHub], value: NewsType.GitHub },
    { label: newsTypeMap[NewsType.Pojie52], value: NewsType.Pojie52 },
    { label: newsTypeMap[NewsType.Xiaohongshu], value: NewsType.Xiaohongshu },
    { label: newsTypeMap[NewsType.Toutiao], value: NewsType.Toutiao },
    { label: newsTypeMap[NewsType.Douban], value: NewsType.Douban },
    { label: newsTypeMap[NewsType.HackerNews], value: NewsType.HackerNews },
    { label: newsTypeMap[NewsType.Zhihu], value: NewsType.Zhihu },
    { label: newsTypeMap[NewsType.ZhihuDaily], value: NewsType.ZhihuDaily },
  ]

  constructor(private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      types: [[]],
      count: [0],
      bgColor: [''],
    })
  }

  open(data: any, idx: number) {
    this.index = idx
    for (const k in data) {
      this.validateForm.get(k)!?.setValue(data[k])
    }
    this.visible = true
  }

  handleClose() {
    this.visible = false
  }

  handleSubmit() {
    const values = this.validateForm.value
    localStorage.removeItem(STORAGE_KEY_MAP.NEWS_DATE)
    this.ok.emit({
      ...values,
      index: this.index,
    })
    this.handleClose()
  }
}
