// Copyright @ 2018-2022 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core'
import { isDark as isDarkFn, randomBgImg, queryString } from '../../utils'
import { NzModalService } from 'ng-zorro-antd/modal'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { getToken } from '../../utils/user'
import { updateFileContent } from '../../services'
import { websiteList, settings } from '../../store'
import { DB_PATH, STORAGE_KEY_MAP } from '../../constants'
import { Router, ActivatedRoute } from '@angular/router'
import { $t, getLocale } from 'src/locale'
import mitt from 'src/utils/mitt'

@Component({
  selector: 'app-fixbar',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FixbarComponent {
  @Input() showCollapse: boolean = true
  @Input() collapsed: boolean
  @Input() selector: string
  @Output() onCollapse = new EventEmitter()

  $t = $t
  settings = settings
  language = getLocale()
  websiteList = websiteList
  isDark: boolean = isDarkFn()
  syncLoading = false
  isLogin = !!getToken()
  themeList = [
    {
      name: $t('_switchTo') + ' Light',
      url: '/light'
    },
    {
      name: $t('_switchTo') + ' Sim',
      url: '/sim'
    },
    {
      name: $t('_switchTo') + ' Side',
      url: '/side'
    },
    {
      name: $t('_switchTo') + ' Shortcut',
      url: '/shortcut'
    },
    {
      name: $t('_switchTo') + ' App',
      url: '/app'
    }
  ]

  constructor(
    private message: NzMessageService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    if (this.isDark) {
      document.documentElement.classList.add('dark-container')
    }

    const url = this.router.url.split('?')[0]
    this.themeList = this.themeList.filter(t => {
      return t.url !== url
    })
  }

  toggleTheme(theme) {
    this.router.navigate([theme.url], {
      queryParams: queryString()
    })
    this.removeBackground()
  }

  goTop() {
    if (this.selector) {
      const el = document.querySelector(this.selector)
      if (el) {
        el.scrollTop = 0
      }
      return
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  collapse() {
    this.onCollapse.emit()
  }

  removeBackground() {
    const el = document.getElementById('random-light-bg')
    el?.parentNode?.removeChild?.(el)
  }

  toggleMode() {
    this.isDark = !this.isDark
    mitt.emit('dark', this.isDark)
    window.localStorage.setItem(STORAGE_KEY_MAP.isDark, String(Number(this.isDark)))
    document.documentElement.classList.toggle('dark-container')

    if (this.isDark) {
      this.removeBackground()
    } else {
      const { data } = this.activatedRoute.snapshot
      data?.renderLinear && randomBgImg()
    }
  }

  goSystemPage() {
    this.router.navigate(['system'])
    const html = document.documentElement
    html.classList.remove('dark-container')
  }

  handleSync() {
    if (this.syncLoading) {
      this.message.warning($t('_repeatOper'))
      return
    }

    this.modal.info({
      nzTitle: $t('_syncDataOut'),
      nzOkText: $t('_confirmSync'),
      nzContent: $t('_confirmSyncTip'),
      nzOnOk: () => {
        this.syncLoading = true;

        updateFileContent({
          message: 'update db',
          content: JSON.stringify(this.websiteList),
          path: DB_PATH
        })
        .then(() => {
          this.message.success($t('_syncSuccessTip'))
        })
        .catch(res => {
          this.notification.error(
            `${$t('_error')}: ${res?.response?.status ?? 1401}`,
            $t('_syncFailTip')
          )
        })
        .finally(() => {
          this.syncLoading = false
        })
      }
    });
  }

  toggleLocale() {
    const l = this.language === 'en' ? 'zh-CN' : 'en'
    window.localStorage.setItem(STORAGE_KEY_MAP.language, l)
    window.location.reload()
  }
}
