// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import {
  Component,
  ViewChild,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { getTextContent, getClassById } from 'src/utils'
import { getTempId } from 'src/utils/utils'
import { updateByWeb, pushDataByAny } from 'src/utils/web'
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms'
import type { IWebProps, IWebTag } from 'src/types'
import { TopType, ActionType } from 'src/types'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { saveUserCollect, getWebInfo, getTranslate } from 'src/api'
import { $t } from 'src/locale'
import { settings, websiteList, tagList, tagMap } from 'src/store'
import { isLogin, getPermissions } from 'src/utils/user'
import { NzModalModule } from 'ng-zorro-antd/modal'
import { NzFormModule } from 'ng-zorro-antd/form'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzSwitchModule } from 'ng-zorro-antd/switch'
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox'
import { NzRateModule } from 'ng-zorro-antd/rate'
import { LogoComponent } from 'src/components/logo/logo.component'
import { UploadComponent } from 'src/components/upload/index.component'
import { NzIconModule } from 'ng-zorro-antd/icon'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { SELF_SYMBOL } from 'src/constants/symbol'
import event from 'src/utils/mitt'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSwitchModule,
    NzCheckboxModule,
    NzRateModule,
    LogoComponent,
    UploadComponent,
    NzIconModule,
    NzButtonModule,
  ],
  selector: 'app-create-web',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class CreateWebComponent {
  @ViewChildren('inputs') inputs!: QueryList<ElementRef>
  @ViewChild('inputUrl', { static: false }) inputUrl!: ElementRef

  readonly $t = $t
  readonly isLogin: boolean = isLogin
  readonly settings = settings
  readonly permissions = getPermissions(settings)
  validateForm!: FormGroup
  tagList = tagList
  uploading = false
  getting = false
  translating = false
  showModal = false
  detail: IWebProps | null | undefined = null
  isMove = false // 提交完是否可以移动
  parentId = -1
  callback: Function = () => {}
  topOptions = [
    { label: TopType[1], value: TopType.Side, checked: false },
    { label: TopType[2], value: TopType.Shortcut, checked: false },
  ]

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private notification: NzNotificationService
  ) {
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
      topOptions: [this.topOptions],
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

  get isTop(): boolean {
    return this.validateForm.get('top')?.value || false
  }

  get desc(): string {
    return (this.validateForm.get('desc')?.value || '').trim()
  }

  get iconUrl(): string {
    return (this.validateForm.get('icon')?.value || '').trim()
  }

  get title(): string {
    return (this.validateForm.get('title')?.value || '').trim()
  }

  open(
    ctx: this,
    props?: {
      isMove?: boolean
      parentId?: number
      detail: IWebProps | null | undefined
    }
  ) {
    const detail = props?.detail
    ctx.detail = detail
    ctx.showModal = true
    ctx.parentId = props?.parentId ?? -1
    ctx.isMove = !!props?.isMove
    this.validateForm.get('title')!.setValue(getTextContent(detail?.name))
    this.validateForm.get('desc')!.setValue(getTextContent(detail?.desc))
    this.validateForm.get('index')!.setValue(detail?.index ?? '')
    this.validateForm.get('icon')!.setValue(detail?.icon || '')
    this.validateForm.get('url')!.setValue(detail?.url || '')
    this.validateForm.get('top')!.setValue(detail?.top ?? false)
    this.validateForm.get('ownVisible')!.setValue(detail?.ownVisible ?? false)
    this.validateForm.get('rate')!.setValue(detail?.rate ?? 5)
    if (detail) {
      if (Array.isArray(detail.tags)) {
        detail.tags.forEach((item: IWebTag) => {
          ;(this.validateForm?.get('urlArr') as FormArray).push?.(
            this.fb.group({
              id: Number(item.id),
              name: tagMap[item.id].name ?? '',
              url: item.url || '',
            })
          )
        })
      }
    }
    const topOptions = this.topOptions.map((item) => {
      item.checked = false
      type V = typeof item.value
      if (detail?.topTypes) {
        const checked = detail.topTypes.some((value: V) => value === item.value)
        item.checked = checked
      }
      return item
    })

    this.validateForm.get('topOptions')!.setValue(topOptions)
    this.focusUrl()
  }

  private focusUrl() {
    if (this.validateForm.get('url')?.value) {
      return
    }
    setTimeout(() => {
      this.inputUrl?.nativeElement?.focus()
    }, 400)
  }

  onClose() {
    // @ts-ignore
    this.validateForm.get('urlArr').controls = []
    this.validateForm.reset()
    this.showModal = false
    this.detail = null
    this.uploading = false
    this.isMove = false
    this.callback = Function
  }

  async onUrlBlur(e: any) {
    if (!settings.openSearch) {
      return
    }

    let url = e.target?.value
    if (!url) {
      return
    }
    try {
      // test url
      if (url[0] === SELF_SYMBOL) {
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
      this.inputUrl?.nativeElement?.blur()
      this.checkRepeat()
    } catch {}
  }

  addMoreUrl() {
    ;(this.validateForm.get('urlArr') as FormArray).push(
      this.fb.group({
        id: '',
        name: '',
        url: '',
      })
    )
  }

  lessMoreUrl(idx: number) {
    ;(this.validateForm.get('urlArr') as FormArray).removeAt(idx)
  }

  onChangeFile(data: any) {
    this.validateForm.get('icon')!.setValue(data.cdn)
  }

  onSelectChange(idx: number) {
    this.inputs.forEach((item, index) => {
      if (idx === index) {
        item.nativeElement.focus()
      }
    })
  }

  handleTranslate(key = 'desc') {
    this.translating = true
    getTranslate({
      content: key === 'desc' ? this.desc : this.title,
    })
      .then((res) => {
        this.validateForm.get(key)!.setValue(res.data.content || '')
      })
      .finally(() => {
        this.translating = false
      })
  }

  checkRepeat() {
    try {
      const { url } = this.validateForm.value
      const { oneIndex, twoIndex, threeIndex, breadcrumb } = getClassById(
        this.parentId
      )
      const w = websiteList[oneIndex].nav[twoIndex].nav[threeIndex].nav
      const repeatData = w.find((item) => {
        if (item.url === url) {
          return true
        }
        try {
          const domain = new URL(item.url).host
          const domain2 = new URL(url).host
          return domain === domain2
        } catch {
          return false
        }
      })
      if (repeatData) {
        this.notification.error(
          $t('_repeatTip'),
          `
          <div>${breadcrumb.join(' / ')}</div>
          <div>ID: ${repeatData.id}</div>
          <div>${$t('_title')}: ${repeatData.name}</div>
          URL: ${repeatData.url}
          `,
          {
            nzDuration: 20000,
          }
        )
      } else {
        this.message.success('OK')
      }
    } catch {}
  }

  async handleOk() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty()
      this.validateForm.controls[i].updateValueAndValidity()
    }

    const tags: IWebTag[] = []
    let { title, icon, url, top, ownVisible, rate, desc, index, topOptions } =
      this.validateForm.value
    title = title.trim()
    if (!title || !url) return

    const urlArr = this.urlArray?.value || []
    urlArr.forEach((item: any) => {
      if (item.id) {
        tags.push({
          id: item.id,
          url: item.url.trim(),
        })
      }
    })

    type TopTypes = typeof this.topOptions
    const topTypes: number[] = (topOptions as TopTypes)
      .filter((item) => item.checked)
      .map((item) => item.value)

    const payload: Record<string, any> = {
      id: this.detail?.id,
      name: title,
      breadcrumb: this.detail?.breadcrumb ?? [],
      rate,
      desc,
      top,
      index,
      ownVisible,
      icon,
      url,
      tags,
      topTypes,
    }

    if (this.detail) {
      if (isLogin) {
        const ok = updateByWeb(this.detail.id, payload as IWebProps)
        if (ok) {
          this.message.success($t('_modifySuccess'))
        } else {
          this.message.error('Update failed')
        }
      } else if (this.permissions.edit) {
        this.uploading = true
        const params = {
          data: {
            ...payload,
            extra: {
              type: ActionType.Edit,
            },
          },
        }
        await saveUserCollect(params)
        this.message.success($t('_waitHandle'))
      }
    } else {
      payload['id'] = getTempId()
      try {
        const { breadcrumb } = getClassById(this.parentId)
        this.uploading = true
        if (this.isLogin) {
          const ok = pushDataByAny(this.parentId, payload)
          ok && this.message.success($t('_addSuccess'))
          if (this.isMove) {
            event.emit('MOVE_WEB', {
              data: [payload],
            })
          }
        } else if (this.permissions.create) {
          const params = {
            data: {
              ...payload,
              parentId: this.parentId,
              breadcrumb,
              extra: {
                type: ActionType.Create,
              },
            },
          }
          await saveUserCollect(params)
          this.message.success($t('_waitHandle'))
        }
      } catch (error: any) {
        this.message.error(error.message)
      }
    }
    this.callback()
    this.onClose()
  }
}
