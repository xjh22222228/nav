// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.

import { Component } from '@angular/core'
import { $t } from 'src/locale';

@Component({
  selector: 'app-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss']
})
export class NoDataComponent {
  $t = $t

  goBack = () => {
    history.go(-1);
  }
}
