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
import { getTempId, isSelfDevelop } from 'src/utils/utils'
import { updateByWeb, pushDataByAny } from 'src/utils/web'
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms'
import type { IWebProps, IWebTag } from 'src/types'
import { TopType, ActionType } from 'src/types'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import {
  saveUserCollect,
  getWebInfo,
  getTranslate,
  getScreenshot,
  createImageFile,
  getImageRepo,
  getCDN,
} from 'src/api'
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
import { SELF_SYMBOL, DEFAULT_SORT_INDEX } from 'src/constants/symbol'
import { JumpService } from 'src/services/jump'
import { removeTrailingSlashes } from 'src/utils/pureUtils'
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
  readonly DEFAULT_SORT_INDEX = DEFAULT_SORT_INDEX
  validateForm!: FormGroup
  tagList = tagList
  submitting = false
  getting = false
  translating = false
  showModal = false
  detail: IWebProps | null | undefined = null
  isMove = false // 提交完是否可以移动
  parentId: number = -1
  callback: Function = () => {}
  topOptions = [
    { label: TopType[1], value: TopType.Side },
    { label: TopType[2], value: TopType.Shortcut },
  ]
  breadcrumb: string[] = []

  constructor(
    public readonly jumpService: JumpService,
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
      topTypes: [[]],
      ownVisible: [false],
      rate: [5],
      icon: [''],
      desc: [''],
      index: [''],
      img: [''],
      urlArr: this.fb.array([]),
    })
  }

  get modalTitle(): string {
    const breadcrumb = (this.detail?.breadcrumb || this.breadcrumb).join(' / ')
    return this.detail
      ? `${$t('_edit')}（${breadcrumb}）`
      : `${$t('_add')}（${breadcrumb}）`
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

  get imgUrl(): string {
    return (this.validateForm.get('img')?.value || '').trim()
  }

  get title(): string {
    return (this.validateForm.get('title')?.value || '').trim()
  }

  get url(): string {
    return (this.validateForm.get('url')?.value || '').trim()
  }

  open(
    ctx: this,
    props?: {
      isKeyboard?: boolean
      isMove?: boolean
      parentId?: number
      detail: IWebProps | null | undefined
    }
  ) {
    if (props?.isKeyboard && this.showModal) {
      return
    }

    const detail = props?.detail
    if (!detail) {
      ctx.parentId = props?.parentId || ctx.parentId
      if (websiteList.length === 0) return
      if (ctx.parentId === -1) {
        const parentId = websiteList[0]?.nav?.[0]?.nav?.[0]?.id
        if (!parentId) {
          return
        }
        ctx.parentId = parentId
      }
    }
    ctx.detail = detail
    ctx.showModal = true
    ctx.isMove = !!props?.isMove
    this.validateForm.get('title')!.setValue(getTextContent(detail?.name))
    this.validateForm.get('desc')!.setValue(getTextContent(detail?.desc))
    this.validateForm.get('index')!.setValue(detail?.index ?? '')
    this.validateForm.get('icon')!.setValue(detail?.icon || '')
    this.validateForm.get('url')!.setValue(detail?.url || '')
    this.validateForm.get('top')!.setValue(detail?.top ?? false)
    this.validateForm.get('topTypes')!.setValue(detail?.topTypes ?? [])
    this.validateForm.get('ownVisible')!.setValue(detail?.ownVisible ?? false)
    this.validateForm.get('rate')!.setValue(detail?.rate ?? 5)
    this.validateForm.get('img')!.setValue(detail?.img ?? '')
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

    if (detail) {
      const { parentId } = getClassById(detail.id, 0, true)
      ctx.parentId = parentId
    } else {
      const { breadcrumb } = getClassById(ctx.parentId)
      ctx.breadcrumb = breadcrumb
    }

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
    this.submitting = false
    this.callback = Function
  }

  async onUrlBlur() {
    if (!settings.openSearch) {
      return
    }
    let url = this.url
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

  onChangeFile(data: any, key: string) {
    this.validateForm.get(key)!.setValue(data.cdn)
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

  getScreenshot() {
    const url = (this.validateForm.get('url')?.value || '').trim()
    this.submitting = true
    getScreenshot({ url })
      .then((res) => {
        const path = `${Date.now()}.png`
        createImageFile({
          branch: getImageRepo().branch,
          message: 'create image',
          content: res.data.image,
          isEncode: false,
          path,
        })
          .then((res) => {
            const value = isSelfDevelop ? res.data.fullImagePath : getCDN(path)
            this.validateForm.get('img')!.setValue(value)
          })
          .finally(() => {
            this.submitting = false
          })
      })
      .catch(() => {
        this.submitting = false
      })
  }

  checkRepeat() {
    try {
      const url = removeTrailingSlashes(this.url)
      const { oneIndex, twoIndex, threeIndex, breadcrumb } = getClassById(
        this.parentId
      )
      const w = websiteList[oneIndex].nav[twoIndex].nav[threeIndex].nav
      const repeatData = w.find((item) => {
        if (this.detail && item.id === this.detail.id) {
          return false
        }
        return item.url === url || item.url.includes(url)
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
        this.message.success($t('_urlNoRepeat'))
      }
    } catch {}
  }

  async handleOk() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty()
      this.validateForm.controls[i].updateValueAndValidity()
    }

    const tags: IWebTag[] = []
    let { top, ownVisible, rate, index, topTypes } = this.validateForm.value
    const title = this.title
    const url = this.url
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

    const payload: Record<string, any> = {
      id: this.detail?.id,
      name: title,
      breadcrumb: this.detail?.breadcrumb ?? [],
      rate,
      desc: this.desc,
      top,
      index,
      ownVisible,
      icon: this.iconUrl,
      url,
      tags,
      topTypes,
      img: this.imgUrl || undefined,
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
        this.submitting = true
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
        this.submitting = true
        payload['breadcrumb'] = this.breadcrumb
        if (this.isLogin) {
          const ok = pushDataByAny(this.parentId, payload)
          if (ok) {
            this.message.success($t('_addSuccess'))
            if (this.isMove) {
              event.emit('MOVE_WEB', {
                data: [payload],
              })
            }
          }
        } else if (this.permissions.create) {
          const params = {
            data: {
              ...payload,
              parentId: this.parentId,
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
