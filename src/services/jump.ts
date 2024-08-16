// 开源项目MIT，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息，允许商业途径。
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class JumpService {
  goUrl(e: any, url: string | null | undefined) {
    e?.stopPropagation?.()
    e?.preventDefault?.()

    if (!url) {
      return
    }

    const self = url[0] === '!'
    window.open(url, self ? '_self' : '_blank')
  }
}
