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
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { SETTING_PATH } from 'src/constants'
import { CODE_SYMBOL } from 'src/constants/symbol'
import { updateFileContent, spiderWebs } from 'src/api'
import { settings, component } from 'src/store'
import { isSelfDevelop, compilerTemplate } from 'src/utils/utils'
import { componentTitleMap } from '../component/types'
import { SafeHtmlPipe } from 'src/pipe/safeHtml.pipe'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzFormModule } from 'ng-zorro-antd/form'
import { NzSliderModule } from 'ng-zorro-antd/slider'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzSwitchModule } from 'ng-zorro-antd/switch'
import { NzTableModule } from 'ng-zorro-antd/table'
import { NzRadioModule } from 'ng-zorro-antd/radio'
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox'
import { NzTabsModule } from 'ng-zorro-antd/tabs'
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm'
import { NzPopoverModule } from 'ng-zorro-antd/popover'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { UploadComponent } from 'src/components/upload/index.component'
import { CardComponent } from 'src/components/card/index.component'
import { ActionType } from 'src/types'
import type { IComponentItemProps, IWebProps, ThemeType } from 'src/types'
import event from 'src/utils/mitt'
import footTemplate from 'src/components/footer/template'
import { replaceJsdelivrCDN } from 'src/utils/pureUtils'

// 额外添加的字段，但不添加到配置中
const extraForm: Record<string, any> = {
  footTemplate: '',
  componentOptions: [],
}

@Component({
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NzSelectModule,
    NzPopoverModule,
    NzTabsModule,
    SafeHtmlPipe,
    NzButtonModule,
    NzFormModule,
    NzSliderModule,
    NzInputModule,
    NzSwitchModule,
    NzTableModule,
    NzRadioModule,
    NzCheckboxModule,
    NzPopconfirmModule,
    UploadComponent,
    CardComponent,
  ],
  selector: 'system-setting',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class SystemSettingComponent {
  readonly $t = $t
  readonly isSelfDevelop = isSelfDevelop
  readonly textareaSize = { minRows: 3, maxRows: 20 }
  validateForm!: FormGroup
  submitting: boolean = false
  settings = settings
  tabActive = 0
  componentOptions: any[] = []
  actionOptions = [
    {
      label: $t('_add'),
      value: ActionType.Create,
    },
    {
      label: $t('_edit'),
      value: ActionType.Edit,
    },
    {
      label: $t('_del'),
      value: ActionType.Delete,
    },
  ]
  webDemoData: IWebProps = {
    id: -1,
    name: '发现导航',
    desc: '发现导航是一个轻量级免费且强大的导航网站',
    url: 'https://nav3.cn',
    icon: replaceJsdelivrCDN(
      'https://gcore.jsdelivr.net/gh/xjh22222228/nav-image@image/logo.svg',
      settings
    ),
    img: replaceJsdelivrCDN(
      'https://gcore.jsdelivr.net/gh/xjh22222228/public@gh-pages/nav/4.png',
      settings
    ),
    tags: [],
    breadcrumb: [],
    rate: 5,
  }

  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private message: NzMessageService
  ) {
    const themeMap: Record<ThemeType, number> = {
      Light: 0,
      Super: 1,
      Sim: 2,
      Side: 3,
      Shortcut: 4,
      App: 5,
    }
    this.tabActive = themeMap[settings.theme] || 0

    this.componentOptions = component.components.map((item) => {
      const data = settings.components.find(
        (c) => item.type === c.type && item.id === c.id
      )
      if (data) {
        extraForm['componentOptions'].push(data.id)
      }
      return {
        label: componentTitleMap[item.type],
        value: item.id,
        type: item.type,
        id: item.id,
      }
    })
    const group: any = {
      ...extraForm,
      ...settings,
    }
    const groupPayload: any = {}
    for (const k in group) {
      groupPayload[k] = [group[k]]
    }
    this.validateForm = this.fb.group(groupPayload)

    event.on('GITHUB_USER_INFO', (data: any) => {
      this.validateForm
        .get('email')!
        .setValue(this.settings.email || data.email || '')
    })
  }

  get cdnUrl(): string {
    return this.validateForm.get('gitHubCDN')?.value
  }

  get footTemplate(): string {
    return compilerTemplate(this.validateForm.get('footerContent')?.value || '')
  }

  onFootTemplateChange(v: any) {
    this.validateForm
      .get('footerContent')!
      .setValue(footTemplate[v]?.trim?.() || '')
  }

  onLogoChange(data: any, key: string) {
    this.settings[key] = data.cdn || ''
    this.validateForm.get(key)?.setValue(this.settings[key])
  }

  onBannerChange(data: any, key: string, idx: number) {
    this.settings[key][idx]['src'] = data.cdn
  }

  onChangeBannerUrl(e: any, key: string, idx: number) {
    const value = e.target.value.trim()
    this.settings[key][idx]['src'] = value
  }

  onChangeJumpUrl(e: any, key: string, idx: number) {
    const value = e.target.value.trim()
    this.settings[key][idx]['url'] = value
  }

  onDeleteBanner(key: string, idx: number) {
    this.settings[key].splice(idx, 1)
  }

  onAddBanner(key: string) {
    this.settings[key].push({
      src: '',
      url: '',
    })
  }

  onShortcutImgChange(e: any) {
    let url = e?.target?.value?.trim() || e.cdn || ''
    this.settings.shortcutThemeImages[0]['src'] = url
  }

  handleMoveUp(key: string, idx: number) {
    if (idx === 0) {
      return
    }
    const data = this.settings[key][idx]
    this.settings[key][idx] = this.settings[key][idx - 1]
    this.settings[key][idx - 1] = data
  }

  handleMoveDown(key: string, idx: number) {
    if (idx === this.settings[key].length - 1) {
      return
    }
    const data = this.settings[key][idx]
    this.settings[key][idx] = this.settings[key][idx + 1]
    this.settings[key][idx + 1] = data
  }

  async handleSpider() {
    await this.handleSubmit()
    this.submitting = true
    try {
      const res = await spiderWebs()
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message)
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            break
          }
          const chunk = JSON.parse(decoder.decode(value))
          if (Array.isArray(chunk)) {
            this.notification.info('Result', chunk.join('<div></div>'))
          } else {
            this.notification.success(`${chunk.time} s`, $t('_saveSuccess'), {
              nzDuration: 0,
            })
          }
        }
      }
    } catch (err: any) {
      this.notification.error('Error', err.message)
    }
    this.submitting = false
  }

  async handleSubmit() {
    if (this.submitting) {
      return
    }

    return new Promise((resolve, reject) => {
      function filterImage(item: Record<string, any>) {
        return item['src'] || item['url'][0] === CODE_SYMBOL
      }
      const formValues = this.validateForm.value
      const values = {
        ...formValues,
        favicon: this.settings.favicon,
        simThemeImages: this.settings.simThemeImages.filter(filterImage),
        shortcutThemeImages:
          this.settings.shortcutThemeImages.filter(filterImage),
        sideThemeImages: this.settings.sideThemeImages.filter(filterImage),
        superImages: this.settings.superImages.filter(filterImage),
        lightImages: this.settings.lightImages.filter(filterImage),
        components: formValues.componentOptions
          .map((id: number) => {
            const data = component.components.find(
              (item: IComponentItemProps) => item.id === id
            )
            return {
              id: data?.id,
              type: data?.type,
            }
          })
          .filter((item: any) => item.type),
      }
      for (const k in extraForm) {
        delete values[k]
      }

      this.submitting = true
      updateFileContent({
        message: 'update settings',
        content: JSON.stringify(values),
        path: SETTING_PATH,
      })
        .finally(() => {
          this.submitting = false
        })
        .then(() => {
          this.message.success($t('_saveSuccess'))
          resolve(null)
        })
        .catch(reject)
    })
  }
}
