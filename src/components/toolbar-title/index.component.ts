// @ts-nocheck
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { INavThreeProp, INavProps } from 'src/types'
import { getToken } from 'src/utils/user'
import { websiteList } from 'src/store'
import event from 'src/utils/mitt'

@Component({
  selector: 'app-toolbar-title',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class ToolbarTitleWebComponent implements OnInit {
  @Input() index: number = 0
  @Input() dataSource: INavThreeProp
  @Input() arrowType: '1' | '2' = '1'
  @Output() onCollapse = new EventEmitter()

  isLogin = !!getToken()
  websiteList: INavProps[] = websiteList

  constructor() {}

  ngOnInit() {}

  openCreateWebModal() {
    event.emit('CREATE_WEB', {
      threeIndex: this.index,
    })
  }
}
