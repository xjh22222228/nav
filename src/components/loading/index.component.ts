// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, ChangeDetectionStrategy } from '@angular/core'

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  selector: 'app-loading',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class LoadingComponent {
  constructor() {}
}
