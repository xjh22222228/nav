// @ts-nocheck
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { getLogoUrl, getTextContent } from 'src/utils'
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms'
import { ITagProp, INavFourProp } from 'src/types'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import * as __tag from '../../../data/tag.json'
import { createFile } from 'src/services'
import { $t } from 'src/locale'

const tagMap: ITagProp = (__tag as any).default
const tagKeys = Object.keys(tagMap)

@Component({
  selector: 'app-create-web',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class CreateWebComponent implements OnInit {
  @Input() detail: object
  @Input() visible: boolean
  @Output() onCancel = new EventEmitter()
  @Output() onOk = new EventEmitter()

  $t = $t
  validateForm!: FormGroup
  iconUrl = ''
  tags = tagKeys
  uploading = false

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private notification: NzNotificationService
  ) {
    this.validateForm = this.fb.group({
      title: ['', [Validators.required]],
      url: ['', [Validators.required]],
      top: [false],
      ownVisible: [false],
      rate: [5],
      icon: [''],
      desc: [''],
      urlArr: this.fb.array([]),
    })
  }

  get urlArray(): FormArray {
    return this.validateForm.get('urlArr') as FormArray
  }

  ngOnChanges() {
    // 回显表单
    setTimeout(() => {
      if (!this.visible) {
        this.validateForm.get('urlArr').controls = []
        this.validateForm.reset()
      }

      const detail = this.detail as INavFourProp
      if (this.detail && this.visible) {
        this.validateForm.get('title')!.setValue(getTextContent(detail.name))
        this.validateForm.get('desc')!.setValue(getTextContent(detail.desc))
        this.validateForm.get('icon')!.setValue(detail.icon || '')
        this.validateForm.get('url')!.setValue(detail.url || '')
        this.validateForm.get('top')!.setValue(detail.top ?? false)
        this.validateForm
          .get('ownVisible')!
          .setValue(detail.ownVisible ?? false)
        this.validateForm.get('rate')!.setValue(detail.rate ?? 5)
        if (typeof detail.urls === 'object') {
          for (let k in detail.urls) {
            this.validateForm.get('urlArr').push(
              this.fb.group({
                name: k,
                url: detail.urls[k],
              })
            )
          }
        }
      }
    }, 100)
  }

  async onUrlBlur(e) {
    const res = await getLogoUrl(e.target?.value)
    if (res) {
      this.iconUrl = res as string
      this.validateForm.get('icon')!.setValue(this.iconUrl)
    }
  }

  onIconFocus() {
    document.addEventListener('paste', this.handlePasteImage)
  }

  onIconBlur(e) {
    document.removeEventListener('paste', this.handlePasteImage)
    this.iconUrl = e.target.value
  }

  addMoreUrl() {
    this.validateForm.get('urlArr').push(
      this.fb.group({
        name: '',
        url: '',
      })
    )
  }

  lessMoreUrl(idx) {
    this.validateForm.get('urlArr').removeAt(idx)
  }

  handlePasteImage = (event) => {
    const items = event.clipboardData.items
    let file = null

    if (items.length) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image')) {
          file = items[i].getAsFile()
          break
        }
      }
    }

    if (file) {
      this.handleUploadImage(file)
    }
  }

  handleUploadImage(file: File) {
    const that = this
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = function () {
      that.uploading = true
      that.iconUrl = this.result as string
      const url = that.iconUrl.split(',')[1]
      const path = `nav-${Date.now()}-${file.name}`

      createFile({
        branch: 'image',
        message: 'create image',
        content: url,
        isEncode: false,
        path,
      })
        .then(() => {
          that.validateForm.get('icon')!.setValue(path)
          that.message.success($t('_uploadSuccess'))
        })
        .catch((res) => {
          that.notification.error(
            `${$t('_error')}: ${res?.response?.status ?? 401}`,
            `${$t('_uploadFail')}：${res.message || ''}`
          )
        })
        .finally(() => {
          that.uploading = false
        })
    }
  }

  onChangeFile(e) {
    const { files } = e.target
    if (files.length <= 0) return
    const file = files[0]

    if (!file.type.startsWith('image')) {
      return this.message.error($t('_notUpload'))
    }
    this.handleUploadImage(file)
  }

  handleCancel() {
    this.onCancel.emit()
  }

  handleOk() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty()
      this.validateForm.controls[i].updateValueAndValidity()
    }

    const createdAt = new Date().toISOString()
    let urls = {}
    let { title, icon, url, top, ownVisible, rate, desc } =
      this.validateForm.value

    if (!title || !url) return

    title = title.trim()
    const urlArr = this.validateForm.get('urlArr')?.value || []
    urlArr.forEach((item) => {
      if (item.name) {
        urls[item.name] = item.url
      }
    })

    const payload = {
      name: title,
      createdAt: (this.detail as any)?.createdAt ?? createdAt,
      rate: rate ?? 0,
      desc: desc || '',
      top: top ?? false,
      ownVisible: ownVisible ?? false,
      icon,
      url,
      urls,
    }

    this.iconUrl = ''
    this.urlArr = []
    this.onOk.emit(payload)
  }
}
