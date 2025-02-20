// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, OnInit, Input } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { isLogin } from 'src/utils/user'
import { copyText, getTextContent } from 'src/utils'
import { setWebsiteList, deleteByWeb } from 'src/utils/web'
import { INavProps, IWebProps, ICardType } from 'src/types'
import { $t, isZhCN } from 'src/locale'
import { settings, websiteList } from 'src/store'
import { JumpService } from 'src/services/jump'
import { NzRateModule } from 'ng-zorro-antd/rate'
import { LogoComponent } from 'src/components/logo/logo.component'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { TagListComponent } from 'src/components/tag-list/index.component'
import { NzToolTipModule } from 'ng-zorro-antd/tooltip'
import { NzIconModule } from 'ng-zorro-antd/icon'
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm'
import { SafeHtmlPipe } from 'src/pipe/safeHtml.pipe'
import event from 'src/utils/mitt'

@Component({
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NzRateModule,
    LogoComponent,
    NzButtonModule,
    TagListComponent,
    NzToolTipModule,
    NzIconModule,
    NzPopconfirmModule,
    SafeHtmlPipe,
  ],
  selector: 'app-card',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() searchKeyword = ''
  @Input() dataSource: IWebProps | Record<string, any> = {}
  @Input() indexs: number[] = []
  @Input() cardStyle: ICardType = 'standard'

  readonly $t = $t
  readonly settings = settings
  readonly websiteList: INavProps[] = websiteList
  readonly isLogin = isLogin
  copyUrlDone = false
  copyPathDone = false

  constructor(public readonly jumpService: JumpService) {}

  ngOnInit(): void {}

  async copyUrl(e: Event, type: 1 | 2): Promise<void> {
    const { name, url } = this.dataSource
    const { origin, hash, pathname } = window.location
    const pathUrl = `${origin}${pathname}${hash}?q=${name}&url=${encodeURIComponent(
      url
    )}`
    const isDone = await copyText(e, type === 1 ? pathUrl : url)

    if (type === 1) {
      this.copyPathDone = isDone
    } else {
      this.copyUrlDone = isDone
    }
  }

  copyMouseout(): void {
    this.copyUrlDone = false
    this.copyPathDone = false
  }

  openEditWebMoal(): void {
    event.emit('CREATE_WEB', {
      detail: this.dataSource,
    })
  }

  onRateChange(rate: number): void {
    this.dataSource.rate = rate
    setWebsiteList(this.websiteList)
  }

  confirmDel(): void {
    deleteByWeb({
      ...(this.dataSource as IWebProps),
      name: getTextContent(this.dataSource.name),
      desc: getTextContent(this.dataSource.desc),
    })
  }

  openMoveWebModal(): void {
    event.emit('MOVE_WEB', {
      indexs: this.indexs,
      data: [this.dataSource],
    })
  }

  get html(): string {
    return this.dataSource.desc.slice(1)
  }

  get getRate(): string {
    const rate = Number(this.dataSource.rate ?? 0)
    return rate > 0 ? `${rate.toFixed(1)}${isZhCN() ? '分' : ''}` : ''
  }
}
