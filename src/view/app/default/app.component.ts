// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { CommonService } from 'src/services/common'

@Component({
  selector: 'app-home',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export default class WebpComponent {
  open: boolean = false

  constructor(public commonService: CommonService) {}

  ngOnInit() {}

  handleCilckNav(index: number) {
    this.commonService.handleCilckTopNav(index)
    this.handleToggleOpen()
  }

  handleToggleOpen() {
    this.open = !this.open
  }
}
