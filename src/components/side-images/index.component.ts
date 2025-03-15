// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import type { ImageProps } from 'src/types'
import { JumpService } from 'src/services/jump'
import { SideImageComponent } from './image/index.component'

@Component({
  standalone: true,
  imports: [CommonModule, SideImageComponent],
  selector: 'app-side-images',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class SideImagesComponent {
  @Input() data: ImageProps[] = []

  constructor(public jumpService: JumpService) {}
}
