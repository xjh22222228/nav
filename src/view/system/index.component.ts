// Copyright @ 2018-2022 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { $t } from 'src/locale'
import { isLogin } from 'src/utils/user'
import { Router } from '@angular/router'
import { STORAGE_KEY_MAP } from 'src/constants'

@Component({
  selector: 'app-system',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export default class SystemComponent {
  $t = $t
  isLogin: boolean = isLogin
  showLoginModal: boolean = !isLogin
  currentMenu: string = ''

  constructor (
    private router: Router,
  ) {}

  ngOnInit () {
    const u = window.location.href.split('/')
    this.currentMenu = u[u.length - 1]
  }

  goBack() {
    this.router.navigate(['/'])
  }

  goRoute(to: string) {
    this.router.navigate([to])
  }

  logout() {
    localStorage.removeItem(STORAGE_KEY_MAP.token)
    this.router.navigate(['/'])
    setTimeout(() => {
      location.reload()
    }, 26)
  }
}
