// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import {
  Component,
  ViewChild,
  ElementRef,
  ViewChildren,
  QueryList,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { CommonService } from 'src/services/common'
import type { INavTwoProp } from 'src/types'
import { scrollIntoViewLeft } from 'src/utils'

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-phone-class',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class PhoneClassComponent {
  @ViewChild('parent') parentRef!: ElementRef
  @ViewChildren('item') itemsRef!: QueryList<ElementRef>

  constructor(public commonService: CommonService) {}

  ngAfterViewInit() {
    scrollIntoViewLeft(
      this.parentRef.nativeElement,
      this.itemsRef.toArray()[this.commonService.twoIndex].nativeElement,
      { behavior: 'auto' }
    )
  }

  handleClickTwo(e: any, data: INavTwoProp) {
    this.commonService.handleClickClass(data.id)
    scrollIntoViewLeft(this.parentRef.nativeElement, e.target)
  }
}
