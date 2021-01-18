// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.

import { Component, Input } from '@angular/core'
import config from '../../../nav.config'
import { totalWeb } from '../../utils'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  footerContent: string = config.footerContent;
  totalWeb: number = totalWeb()

  @Input() className: string
}
