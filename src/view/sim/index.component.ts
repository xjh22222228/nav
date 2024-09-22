// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.

import { Component } from '@angular/core'
import { isLogin } from 'src/utils/user'
import { settings, internal } from 'src/store'
import { CommonService } from 'src/services/common'

@Component({
  selector: 'app-sim',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class SimComponent {
  description: string = settings.simThemeDesc.replace(
    '${total}',
    String(isLogin ? internal.loginViewCount : internal.userViewCount)
  )

  constructor(public commonService: CommonService) {}

  ngOnDestroy() {
    this.commonService.overIndex = Number.MAX_SAFE_INTEGER
  }

  ngAfterViewInit() {
    if (this.commonService.settings.simOverType === 'ellipsis') {
      this.commonService.getOverIndex('.top-nav .over-item')
    }
  }
}
