// 开源项目MIT，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息，允许商业途径。
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component, Input } from '@angular/core'
import { settings, internal } from 'src/store'
import { isLogin } from 'src/utils/user'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  @Input() className: string = ''
  @Input() content: string = ''

  footerContent: string = ''

  constructor() {}

  ngOnInit() {
    this.footerContent = (this.content || settings.footerContent)
      .replace(
        '${total}',
        String(isLogin ? internal.loginViewCount : internal.userViewCount)
      )
      .replace('${hostname}', window.location.hostname)
      .replace('${year}', String(new Date().getFullYear()))
  }
}
