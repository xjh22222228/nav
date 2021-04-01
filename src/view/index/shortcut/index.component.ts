// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.

import config from '../../../../nav.config'
import { Component } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { INavProps, INavThreeProp } from '../../../types'
import {
  fuzzySearch,
  queryString,
  setWebsiteList,
  toggleCollapseAll,
  totalWeb,
} from '../../../utils'
import { initRipple, setAnnotate } from '../../../utils/ripple'
import { websiteList } from '../../../store'

const { gitRepoUrl, title, simThemeConfig } = config

@Component({
  selector: 'app-shortcut',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export default class ShortcutComponent {
  title = title

  constructor (private router: Router, private activatedRoute: ActivatedRoute) {}
}
