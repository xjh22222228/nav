// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.

import config from '../../../../nav.config'
import { Component } from '@angular/core'
import { isDark as isDarkFn } from 'src/utils'
import mitt from 'src/utils/mitt'

const { title } = config

@Component({
  selector: 'app-shortcut',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export default class ShortcutComponent {
  title = title
  isDark: boolean = isDarkFn()

  constructor () {
    mitt.on('dark', (isDark: boolean) => {
      this.isDark = isDark
    })
  }
}
