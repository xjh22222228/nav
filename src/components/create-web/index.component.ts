// 开源项目MIT，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息，允许商业途径。
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component, Output, EventEmitter } from '@angular/core'
import { queryString, getTextContent } from 'src/utils'
import { setWebsiteList, updateByWeb } from 'src/utils/web'
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms'
import { IWebProps } from 'src/types'
import { NzMessageService } from 'ng-zorro-antd/message'
import { saveUserCollect, getWebInfo } from 'src/api'
import { $t } from 'src/locale'
import { settings, websiteList, tagList, tagMap } from 'src/store'
import { isLogin } from 'src/utils/user'
import event from 'src/utils/mitt'

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
  tagList = tagList
  uploading = false
  getting = false
  settings = settings
  showModal = false
  detail: any = null
  isMove = false // 提交完是否可以移动
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
      index: [''],
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
          isMove?: boolean
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
    ctx.isMove = !!props.isMove
    this.validateForm.get('title')!.setValue(getTextContent(detail?.name))
    this.validateForm.get('desc')!.setValue(getTextContent(detail?.desc))
    this.validateForm.get('index')!.setValue(detail?.index ?? '')
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

  get iconUrl() {
    return this.validateForm.get('icon')?.value || ''
  }

  onClose() {
    // @ts-ignore
    this.validateForm.get('urlArr').controls = []
    this.validateForm.reset()
    this.showModal = false
    this.detail = null
    this.oneIndex = undefined
    this.twoIndex = undefined
    this.threeIndex = undefined
    this.uploading = false
    this.isMove = false
    this.callback = Function
  }

  async onUrlBlur(e: any) {
    let url = e.target?.value
    if (!url) {
      return
    }
    try {
      // test url
      if (url[0] === '!') {
        url = url.slice(1)
      }
      new URL(url)

      const iconVal = this.validateForm.get('icon')?.value
      const titleVal = this.validateForm.get('title')?.value
      const descVal = this.validateForm.get('desc')?.value
      if (iconVal && titleVal && descVal) {
        return
      }

      this.getting = true
      const res = await getWebInfo(url)
      if (res['url'] != null && !iconVal) {
        this.validateForm.get('icon')!.setValue(res['url'])
      }
      if (res['title'] != null && !titleVal) {
        this.validateForm.get('title')!.setValue(res['title'])
      }
      if (res['description'] != null && !descVal) {
        this.validateForm.get('desc')!.setValue(res['description'])
      }
      this.getting = false
    } catch (error) {}
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

  onChangeFile(data: any) {
    this.validateForm.get('icon')!.setValue(data.cdn)
  }

  async handleOk() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty()
      this.validateForm.controls[i].updateValueAndValidity()
    }

    const createdAt = new Date().toString()
    let urls: Record<string, any> = {}
    let { title, icon, url, top, ownVisible, rate, desc, index } =
      this.validateForm.value

    if (!title || !url) return

    title = title.trim()
    const urlArr = this.validateForm.get('urlArr')?.value || []
    urlArr.forEach((item: any) => {
      if (item.id) {
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
      index,
      ownVisible: ownVisible ?? false,
      icon,
      url,
      urls,
    }

    if (this.detail) {
      const ok = updateByWeb(this.detail, payload as IWebProps)
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
        this.uploading = true
        if (this.isLogin) {
          w.unshift(payload as IWebProps)
          setWebsiteList(websiteList)
          this.message.success($t('_addSuccess'))
          if (this.isMove) {
            event.emit('MOVE_WEB', {
              indexs: [oneIndex, twoIndex, threeIndex, 0],
              data: [payload],
            })
          }
        } else if (this.settings.allowCollect) {
          try {
            await saveUserCollect({
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
            this.message.success($t('_waitHandle'))
          } catch {}
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
