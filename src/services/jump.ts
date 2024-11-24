// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import event from 'src/utils/mitt'

@Injectable({
  providedIn: 'root',
})
export class JumpService {
  constructor(private router: Router) {}

  goUrl(e: any, url: string | null | undefined) {
    e?.stopPropagation?.()
    e?.preventDefault?.()

    if (typeof url !== 'string' || !url) {
      return
    }

    if (url === '@apply') {
      event.emit('CREATE_WEB')
      return
    }

    if (url[0] === '@') {
      this.router.navigate([url.slice(1)])
      return
    }

    const self = url[0] === '!'
    if (self) {
      window.open(url.slice(1), '_self')
    } else {
      window.open(url)
    }
  }
}
