// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.

import config from '../../../../nav.config'
import { Component } from '@angular/core'

const { title } = config

@Component({
  selector: 'app-shortcut',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export default class ShortcutComponent {
  title = title

  constructor () {}
}
