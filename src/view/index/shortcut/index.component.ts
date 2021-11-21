// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.

import { Component } from '@angular/core'
import { isDark as isDarkFn } from 'src/utils'
import { settings } from 'src/store'
import mitt from 'src/utils/mitt'

const { title, shortcutThemeShowWeather, shortcutThemeImages } = settings

@Component({
  selector: 'app-shortcut',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export default class ShortcutComponent {
  title = title
  isDark: boolean = isDarkFn()
  shortcutThemeShowWeather = shortcutThemeShowWeather
  shortcutThemeImage = shortcutThemeImages[0].src

  constructor () {
    mitt.on('dark', (isDark: boolean) => {
      this.isDark = isDark
    })
  }
}
