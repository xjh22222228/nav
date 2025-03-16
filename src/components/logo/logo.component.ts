// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav
import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { randomColor, getTextContent } from 'src/utils'

@Component({
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
})
export class LogoComponent {
  @Input() src: string = ''
  @Input() name: string = ''
  @Input() size: number = 35
  @Input() radius: number = 3
  @Input() check: boolean = true

  backgroundColor: string = '#1890ff'
  firstLetter: string = ''
  isError: boolean = false

  constructor() {}

  ngOnInit() {
    if (!this.src) {
      this.generateColor()
      this.getFirstLetter()
    }
  }

  private generateColor() {
    this.backgroundColor = `linear-gradient(45deg, #fff, ${randomColor()} 41%)`
  }

  private getFirstLetter() {
    if (this.name) {
      this.firstLetter = getTextContent(this.name)[0].toUpperCase()
    }
  }

  onError() {
    this.isError = true
    this.generateColor()
    this.getFirstLetter()
  }
}
