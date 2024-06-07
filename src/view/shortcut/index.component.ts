// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.

import { Component } from '@angular/core'
import { isDark as isDarkFn } from 'src/utils'
import { settings } from 'src/store'
import event from 'src/utils/mitt'

@Component({
  selector: 'app-shortcut',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class ShortcutComponent {
  settings = settings
  isDark: boolean = isDarkFn()
  shortcutThemeImage = settings.shortcutThemeImages?.[0]?.['src']

  constructor() {
    event.on('EVENT_DARK', (isDark: any) => {
      this.isDark = isDark
    })
  }
}
