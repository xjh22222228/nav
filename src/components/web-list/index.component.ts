// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component, OnInit, Input } from '@angular/core'
import { websiteList } from '../../store'
import { INavFourProp } from 'src/types'

@Component({
  selector: 'app-web-list',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class WebListComponent implements OnInit {
  @Input() max: number = 99999

  dataList: INavFourProp[] = []

  constructor() {}

  ngOnInit() {
    this.getTopWeb()
  }

  getTopWeb() {
    const dataList: INavFourProp[] = []
    const max = this.max

    function r(nav) {
      if (!Array.isArray(nav)) return
  
      for (let i = 0; i < nav.length; i++) {
        if (dataList.length > max) {
          break
        }

        const item = nav[i]
        if (item.url) {
          if (item.top) {
            dataList.push(item)
          }
        } else {
          r(item.nav)
        }
      }
    }
    r(websiteList)

    this.dataList = dataList
  }
}
