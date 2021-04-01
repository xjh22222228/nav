// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import hotkeys from 'hotkeys-js'
import config from '../../../nav.config'
import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core'
import { isDark as isDarkFn, randomBgImg, queryString } from '../../utils'
import { NzModalService } from 'ng-zorro-antd/modal'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { getToken } from '../../utils/user'
import { updateFileContent } from '../../services'
import { websiteList } from '../../store'
import { DB_PATH, KEY_MAP, VERSION, STORAGE_KEY_MAP } from '../../constants'
import { Router, ActivatedRoute } from '@angular/router'
import { setAnnotate } from '../../utils/ripple'

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

  websiteList = websiteList
  isDark: boolean = isDarkFn()
  showCreateModal = false
  syncLoading = false
  isLogin = !!getToken()
  themeList = [
    {
      name: '切换到 Light',
      url: '/light'
    },
    {
      name: '切换到 Sim',
      url: '/sim'
    },
    {
      name: '切换到 Side',
      url: '/side'
    },
    {
      name: '切换到 Shortcut',
      url: '/shortcut'
    },
    {
      name: '切换到 App',
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
    if (isDarkFn()) {
      document.documentElement.classList.add('dark-container')
    }

    const url = this.router.url.split('?')[0]
    this.themeList = this.themeList.filter(t => {
      return t.url !== url
    })

    this.initHotKeys()
  }

  ngOnDestroy() {
    hotkeys.unbind()
  }

  initHotKeys() {
    hotkeys(KEY_MAP.view, (e) => {
      e.preventDefault()
      this.viewInfo()
    })
    hotkeys(KEY_MAP.dark, (e) => {
      e.preventDefault()
      this.toggleMode()
    })
  }

  viewInfo() {
    const date = document.getElementById('META-NAV')?.dataset?.date

    this.modal.info({
      nzWidth: 500,
      nzTitle: '以下信息只有您能查看，请放心！',
      nzOkText: '知道了',
      nzContent: `
        <p>Token: ${getToken()}</p>
        <p>部署分支: ${config.branch}</p>
        <p>上次构建时间: ${date || '未知'}</p>
        <p>当前版本: <img src="https://img.shields.io/badge/release-v${VERSION}-red.svg?longCache=true&style=flat-square"></p>
        <p>最新版本: <img src="https://img.shields.io/github/v/release/xjh22222228/nav" /></p>
      `,
    });
  }

  toggleTheme(theme) {
    this.router.navigate([theme.url], {
      queryParams: queryString()
    })
    this.removeBackground()
    setTimeout(() => {
      setAnnotate()
    }, 100)
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
    window.localStorage.setItem(STORAGE_KEY_MAP.isDark, String(Number(this.isDark)))
    document.documentElement.classList.toggle('dark-container')

    if (this.isDark) {
      this.removeBackground()
    } else {
      const { data } = this.activatedRoute.snapshot
      data?.renderLinear && randomBgImg()
    }
  }

  toggleModal() {
    if (this.isLogin) {
      this.removeBackground()
      this.router.navigate(['admin'])
      return
    }
    this.showCreateModal = !this.showCreateModal
  }

  handleSync() {
    if (this.syncLoading) {
      this.message.warning('请不要频繁操作')
      return
    }

    this.modal.info({
      nzTitle: '同步数据到远端',
      nzOkText: '确定同步',
      nzContent: '确定将所有数据同步到远端吗？这可能需要消耗一定的时间。',
      nzOnOk: () => {
        this.syncLoading = true;

        updateFileContent({
          message: 'update db',
          content: JSON.stringify(this.websiteList),
          path: DB_PATH
        })
        .then(() => {
          this.message.success('同步成功, 大约需要5分钟构建时间')
        })
        .catch(res => {
          this.notification.error(
            `错误: ${res?.response?.status ?? 1401}`,
            '同步失败, 请重试'
          )
        })
        .finally(() => {
          this.syncLoading = false
        })
      }
    });
  }
}
