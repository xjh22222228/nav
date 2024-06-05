// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { queryString, setLocation } from '../utils'
import { en_US, NzI18nService, zh_CN } from 'ng-zorro-antd/i18n'
import { getLocale } from 'src/locale'
import { settings } from 'src/store'
import { verifyToken } from 'src/services'
import { getToken, userLogout } from 'src/utils/user'
import { NzMessageService } from 'ng-zorro-antd/message'

@Component({
  selector: 'app-xiejiahe',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isLogin: boolean = !!getToken()

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private i18n: NzI18nService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.goRoute()
    this.activatedRoute.queryParams.subscribe(setLocation)

    if (getLocale() === 'zh-CN') {
      this.i18n.setLocale(zh_CN)
    } else {
      this.i18n.setLocale(en_US)
    }

    const token = getToken()
    if (token) {
      verifyToken(token).catch(() => {
        this.message.error('Token 失效，请重新登录')
        userLogout()
        setTimeout(() => {
          location.reload()
        }, 3000)
      })
    }
  }

  goRoute() {
    // is App
    if ('ontouchstart' in window) {
      const url = (this.router.url.split('?')[0] || '').toLowerCase()
      const { page, id, q } = queryString()
      const queryParams = { page, id, q }
      const path = '/' + String(settings.appTheme).toLowerCase()

      if (!url.includes(path)) {
        this.router.navigate([path], { queryParams })
      }
    }
  }
}
