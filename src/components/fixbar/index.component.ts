// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.

import { Component, Output, EventEmitter, Input } from '@angular/core'
import { isDark as isDarkFn, randomBgImg, queryString } from '../../utils'
import { NzModalService } from 'ng-zorro-antd/modal'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { getToken } from '../../utils/user'
import { updateFileContent } from '../../services'
import { websiteList, isEditing } from '../../store'
import { DB_PATH } from '../../constants'
import { Router } from '@angular/router'
import { setAnnotate } from '../../utils/ripple'

@Component({
  selector: 'app-fixbar',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class FixbarComponent {

  @Input() collapsed: boolean
  @Input() randomBg: boolean
  @Input() selector: string
  @Output() onCollapse = new EventEmitter()

  websiteList = websiteList
  isDark: boolean = isDarkFn()
  showCreateModal = false
  syncLoading = false
  isLogin = !!getToken()
  isEditing = isEditing
  themeList = [
    {
      name: '切换到 Light',
      url: '/light'
    },
    {
      name: '切换到 Sim',
      url: '/sim'
    }
  ]

  constructor(
    private message: NzMessageService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private router: Router
  ) {}

  ngOnInit() {
    if (isDarkFn()) {
      document.body.classList.add('dark-container')
      this.toggleZorroDark(true)
    }

    const url = this.router.url.split('?')[0]
    this.themeList = this.themeList.filter(t => {
      return t.url !== url
    })
  }

  toggleZorroDark(dark: boolean) {
    if (dark) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = '/assets/ng-zorro-antd.dark.css'
      link.className = 'NG-ZORRO-DARK'
      document.body.append(link)
    } else {
      const findLink = document.querySelectorAll('.NG-ZORRO-DARK')
      findLink.forEach(child => {
        child.parentNode.removeChild(child)
      })
    }
  }

  toggleTheme(theme) {
    this.router.navigate([theme.url], {
      queryParams: queryString()
    })
    setTimeout(() => {
      setAnnotate()
    }, 100)
  }

  toggleEditMode() {
    this.isEditing.value = !this.isEditing.value
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

  toggleMode() {
    this.isDark = !this.isDark
    window.localStorage.setItem('IS_DARK', String(Number(this.isDark)))
    document.body.classList.toggle('dark-container')

    if (this.isDark) {
      const el = document.getElementById('random-light-bg')
      el?.parentNode?.removeChild?.(el)
      this.toggleZorroDark(true)
    } else {
      this.randomBg && randomBgImg()
      this.toggleZorroDark(false)
    }
  }

  toggleModal() {
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
            `错误: ${res?.response?.status ?? 404}`,
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
