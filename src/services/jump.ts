// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { CODE_SYMBOL, SELF_SYMBOL, ROUTER_SYMBOL } from 'src/constants/symbol'
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
    const firstSymbol = url[0]

    // Code
    if (firstSymbol === CODE_SYMBOL) {
      return
    }

    if (url === '@apply') {
      event.emit('CREATE_WEB')
      return
    }

    if (firstSymbol === ROUTER_SYMBOL) {
      this.router.navigate([url.slice(1)])
      return
    }

    const self = firstSymbol === SELF_SYMBOL
    if (self) {
      window.open(url.slice(1), '_self')
    } else {
      window.open(url)
    }
  }
}
