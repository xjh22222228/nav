// 开源项目MIT，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息，允许商业途径。
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { randomBgImg } from 'src/utils'
import { ServiceCommonService } from 'src/services/common'

@Component({
  selector: 'app-light',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class LightComponent {
  constructor(public serviceCommon: ServiceCommonService) {}

  ngOnInit() {
    randomBgImg()
  }

  ngAfterViewInit() {
    if (this.serviceCommon.settings.lightOverType === 'ellipsis') {
      this.serviceCommon.getOverIndex('.top-nav .over-item')
    }
  }
}
