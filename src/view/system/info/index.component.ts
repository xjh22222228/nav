// @ts-nocheck
// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { $t } from 'src/locale'
import { getToken } from 'src/utils/user'
import { VERSION } from 'src/constants'
import { isSelfDevelop } from 'src/utils/utils'
import config from '../../../../nav.config.json'

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'system-info',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class SystemInfoComponent {
  $t = $t
  isSelfDevelop = isSelfDevelop
  token = getToken()
  config = config
  date = document.getElementById('META-NAV')?.dataset?.['date'] || $t('_unknow')
  currentVersionSrc = `https://img.shields.io/badge/current-v${VERSION}-red.svg?longCache=true&style=flat-square`

  constructor() {}

  ngOnInit() {}
}
