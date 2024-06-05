// @ts-nocheck
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import {
  getLogoUrl,
  getTextContent,
  updateByWeb,
  queryString,
  setWebsiteList,
} from 'src/utils'
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms'
import { ITagProp, IWebProps } from 'src/types'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import * as __tag from '../../../data/tag.json'
import { createFile } from 'src/services'
import { $t } from 'src/locale'
import { settings, websiteList } from 'src/store'
import event from 'src/utils/mitt'

const tagMap: ITagProp = (__tag as any).default
const tagKeys = Object.keys(tagMap)

@Component({
  selector: 'app-create-web',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class CreateWebComponent implements OnInit {
  @Output() onOk = new EventEmitter()

  $t = $t
  validateForm!: FormGroup
  iconUrl = ''
  tags = tagKeys
  uploading = false
  settings = settings
  showModal = false
  detail: any = null
  oneIndex: number | undefined
  twoIndex: number | undefined
  threeIndex: number | undefined

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private notification: NzNotificationService
  ) {
    event.on('CREATE_WEB', (props) => {
      this.open(this, props)
    })
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

  open(
    ctx,
    props: {
      detail: IWebProps | null
      oneIndex: number | undefined
      twoIndex: number | undefined
      threeIndex: number | undefined
    } = {}
  ) {
    const detail = props.detail
    ctx.detail = detail
    ctx.showModal = true
    ctx.oneIndex = props.oneIndex
    ctx.twoIndex = props.twoIndex
    ctx.threeIndex = props.threeIndex
    this.validateForm.get('title')!.setValue(getTextContent(detail?.name))
    this.validateForm.get('desc')!.setValue(getTextContent(detail?.desc))
    this.validateForm.get('icon')!.setValue(detail?.icon || '')
    this.validateForm.get('url')!.setValue(detail?.url || '')
    this.validateForm.get('top')!.setValue(detail?.top ?? false)
    this.validateForm.get('ownVisible')!.setValue(detail?.ownVisible ?? false)
    this.validateForm.get('rate')!.setValue(detail?.rate ?? 5)
    if (detail) {
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
  }

  onClose() {
    this.validateForm.get('urlArr').controls = []
    this.validateForm.reset()
    this.showModal = false
    this.detail = null
    this.iconUrl = ''
    this.oneIndex = undefined
    this.twoIndex = undefined
    this.threeIndex = undefined
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
      id: -Date.now(),
      name: title,
      createdAt: (this.detail as any)?.createdAt ?? createdAt,
      rate: rate ?? 5,
      desc: desc || '',
      top: top ?? false,
      ownVisible: ownVisible ?? false,
      icon,
      url,
      urls,
    }

    if (this.detail) {
      const ok = updateByWeb(
        {
          ...this.detail,
          name: getTextContent(this.detail.name),
          desc: getTextContent(this.detail.desc),
        },
        payload
      )
      if (ok) {
        this.message.success($t('_modifySuccess'))
      } else {
        this.message.error('修改失败，找不到ID，请同步远端后尝试')
      }
    } else {
      try {
        const { page, id } = queryString()
        const oneIndex = this.oneIndex ?? page
        const twoIndex = this.twoIndex ?? id
        const threeIndex = this.threeIndex
        const w = websiteList[oneIndex].nav[twoIndex].nav[threeIndex].nav
        const exists = w.some((item) => item.name === payload.name)
        if (exists) {
          return this.message.error(`${$t('_repeatAdd')} "${payload.name}"`)
        }
        w.unshift(payload)
        setWebsiteList(websiteList)
        this.message.success($t('_addSuccess'))
      } catch (error) {
        this.message.error(error.message)
      }
    }
    this.onOk?.emit?.(payload)
    this.onClose()
  }
}
