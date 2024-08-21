// 开源项目MIT，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息，允许商业途径。
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component, Input } from '@angular/core'
import { JumpService } from 'src/services/jump'

@Component({
  selector: 'app-swiper',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class SwiperComponent {
  @Input() images: any[] = []
  @Input() autoplay = true
  @Input() height = 300

  mySwiper: any = null
  swiperId = 'swiper'

  constructor(public jumpService: JumpService) {
    this.swiperId = 'swiper' + parseInt(String(Math.random() * 1000))
  }

  ngAfterViewInit() {
    this.initSwiper()
  }

  ngOnDestroy() {
    this.destroySwiper()
  }

  initSwiper() {
    this.destroySwiper()
    const el = document.getElementById(this.swiperId)
    if (!el || !Swiper) {
      console.log('swiper not found')
      return
    }
    this.mySwiper = new Swiper(el, {
      loop: true,
      autoplay: this.autoplay
        ? {
            delay: 5000,
          }
        : false,

      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    })
  }

  destroySwiper() {
    if (this.mySwiper) {
      this.mySwiper?.destroy?.()
      this.mySwiper = null
    }
  }
}
