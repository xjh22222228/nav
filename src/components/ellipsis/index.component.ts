// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component, Input, ViewChild, ElementRef } from '@angular/core'

function getWidthInText(str) {
  let w = 0

  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i)
    if (code >= 0 && code <= 127) {
      w += 7.28
    } else {
      w += 15
    }
  }

  return w
}

@Component({
  selector: 'app-ellipsis',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class EllipsisComponent {
  @Input() text: string
  @Input() icon: string
  @ViewChild('box') box: ElementRef<Element>;

  isOver = false

  ngOnInit() {
    queueMicrotask(() => {
      const el = this.box?.nativeElement
      if (!el) return

      const textWidth = el.clientWidth
      const w = getWidthInText(this.text)

      if (textWidth < w) {
        this.isOver = true
      }
    })
  }
}
