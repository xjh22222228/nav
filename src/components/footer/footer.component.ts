// @ts-nocheck
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
  footerContent: string = settings.footerContent.replace(
    '${total}',
    String(isLogin ? internal.loginViewCount : internal.userViewCount)
  )

  @Input() className: string
}
