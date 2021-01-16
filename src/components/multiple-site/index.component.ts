// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.

import { Component, Input } from '@angular/core'
import config from '../../../nav.config'
import { INavFourProp } from '../../types'

@Component({
  selector: 'app-multiple-site',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class MultipleSiteComponent {
  @Input() dataSource: INavFourProp

  language: string[] = config.indexLanguage
}
