// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component, Output, EventEmitter } from '@angular/core'
import {
  getWebInfo,
  getTextContent,
  updateByWeb,
  queryString,
  setWebsiteList,
} from 'src/utils'
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms'
import { IWebProps } from 'src/types'
import { NzMessageService } from 'ng-zorro-antd/message'
import { createFile, saveUserCollect } from 'src/services'
import { $t } from 'src/locale'
import { settings, websiteList, tagList, tagMap } from 'src/store'
import event from 'src/utils/mitt'
import { isLogin } from 'src/utils/user'

@Component({
  selector: 'app-create-web',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class CreateWebComponent {
  @Output() onOk = new EventEmitter()

  $t = $t
  isLogin: boolean = isLogin
  validateForm!: FormGroup
  iconUrl = ''
  tagList = tagList
  uploading = false
  getting = false
  settings = settings
  showModal = false
  detail: any = null
  oneIndex: number | undefined
  twoIndex: number | undefined
  threeIndex: number | undefined
  callback: Function = () => {}

  constructor(private fb: FormBuilder, private message: NzMessageService) {
    event.on('CREATE_WEB', (props: any) => {
      this.open(this, props)
    })
    event.on('SET_CREATE_WEB', (props: any) => {
      for (const k in props) {
        // @ts-ignore
        this[k] = props[k]
      }
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
    ctx: this,
    props:
      | {
          detail: IWebProps | null
          oneIndex: number | undefined
          twoIndex: number | undefined
          threeIndex: number | undefined
        }
      | Record<string, any> = {}
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
          // @ts-ignore
          this.validateForm?.get('urlArr').push?.(
            this.fb.group({
              id: Number(k),
              name: tagMap[k]?.name ?? '',
              url: detail.urls[k],
            })
          )
        }
      }
    }
  }

  onClose() {
    // @ts-ignore
    this.validateForm.get('urlArr').controls = []
    this.validateForm.reset()
    this.showModal = false
    this.detail = null
    this.iconUrl = ''
    this.oneIndex = undefined
    this.twoIndex = undefined
    this.threeIndex = undefined
    this.uploading = false
    this.callback = Function
  }

  async onUrlBlur(e: any) {
    const url = e.target?.value
    if (!url) {
      return
    }
    this.getting = true
    const res = await getWebInfo(url)
    if (res['url'] != null) {
      this.iconUrl = res['url']
      this.validateForm.get('icon')!.setValue(this.iconUrl)
    }
    if (res['title'] != null) {
      this.validateForm.get('title')!.setValue(res['title'])
    }
    if (res['description'] != null) {
      this.validateForm.get('desc')!.setValue(res['description'])
    }
    if (res['status'] === false) {
      this.message.error('自动抓取失败，请手动写入')
    }
    this.getting = false
  }

  addMoreUrl() {
    // @ts-ignore
    this.validateForm.get('urlArr').push(
      this.fb.group({
        id: '',
        name: '',
        url: '',
      })
    )
  }

  lessMoreUrl(idx: number) {
    // @ts-ignore
    this.validateForm.get('urlArr').removeAt(idx)
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
        .finally(() => {
          that.uploading = false
        })
    }
  }

  onChangeFile(e: any) {
    const { files } = e.target
    if (files.length <= 0) return
    const file = files[0]

    if (!file.type.startsWith('image')) {
      return this.message.error($t('_notUpload'))
    }
    this.handleUploadImage(file)
  }

  async handleOk() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty()
      this.validateForm.controls[i].updateValueAndValidity()
    }

    const createdAt = new Date().toString()
    let urls: Record<string, any> = {}
    let { title, icon, url, top, ownVisible, rate, desc } =
      this.validateForm.value

    if (!title || !url) return

    title = title.trim()
    const urlArr = this.validateForm.get('urlArr')?.value || []
    urlArr.forEach((item: any) => {
      if (item.id != null) {
        urls[item.id] = item.url
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
        payload as IWebProps
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
        const threeIndex = this.threeIndex as number
        const w = websiteList[oneIndex].nav[twoIndex].nav[threeIndex].nav
        const exists = w.some((item: any) => item.name === payload.name)
        if (exists) {
          return this.message.error(`${$t('_repeatAdd')} "${payload.name}"`)
        }
        this.uploading = true
        if (this.isLogin) {
          w.unshift(payload as IWebProps)
          setWebsiteList(websiteList)
          this.message.success($t('_addSuccess'))
        } else if (this.settings.allowCollect) {
          const res = await saveUserCollect({
            email: this.settings.email,
            data: {
              ...payload,
              extra: {
                type: 'create',
                oneName: websiteList[oneIndex].title,
                twoName: websiteList[oneIndex].nav[twoIndex].title,
                threeName:
                  websiteList[oneIndex].nav[twoIndex].nav[threeIndex].title,
              },
            },
          })
          if (res.data.success === false) {
            this.message.error(res.data.message)
          } else {
            this.message.error($t('_waitHandle'))
          }
        }
      } catch (error: any) {
        this.message.error(error.message)
      }
    }
    this.callback()
    this.onOk?.emit?.(payload)
    this.onClose()
  }
}
