// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component, OnInit } from '@angular/core'
import { getToken } from '../../utils/user'
import { websiteList } from '../../store'
import { INavFourProp } from 'src/types'

@Component({
  selector: 'app-web-list',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class WebListComponent implements OnInit {
  isLogin = !!getToken()
  dataList: INavFourProp[] = []

  constructor() {}

  ngOnInit() {
    this.getTopWeb()
  }

  getTopWeb() {
    const dataList: INavFourProp[] = []
    function r(nav) {
      if (!Array.isArray(nav)) return
  
      for (let i = 0; i < nav.length; i++) {
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
