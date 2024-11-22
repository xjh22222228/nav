// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { isLogin } from 'src/utils/user'
import { copyText, getTextContent } from 'src/utils'
import { setWebsiteList, deleteByWeb } from 'src/utils/web'
import { INavProps, IWebProps, ICardType } from 'src/types'
import { $t } from 'src/locale'
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-card',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() searchKeyword: string = ''
  @Input() dataSource: IWebProps | Record<string, any> = {}
  @Input() indexs: Array<number> = []
  @Input() cardStyle: ICardType = 'standard'

  $t = $t
  settings = settings
  websiteList: INavProps[] = websiteList
  isLogin: boolean = isLogin
  copyUrlDone = false
  copyPathDone = false

  constructor(public jumpService: JumpService) {}

  ngOnInit(): void {}

  async copyUrl(e: Event, type: number) {
    const w = this.dataSource
    const { origin, hash, pathname } = window.location
    const pathUrl = `${origin}${pathname}${hash}?q=${
      w.name
    }&url=${encodeURIComponent(w.url)}`
    const isDone = await copyText(e, type === 1 ? pathUrl : w.url)

    if (type === 1) {
      this.copyPathDone = isDone
    } else {
      this.copyUrlDone = isDone
    }
  }

  copyMouseout() {
    this.copyUrlDone = false
    this.copyPathDone = false
  }

  openEditWebMoal() {
    event.emit('CREATE_WEB', {
      detail: this.dataSource,
    })
  }

  onRateChange(n: any) {
    this.dataSource.rate = n
    setWebsiteList(this.websiteList)
  }

  confirmDel() {
    deleteByWeb({
      ...(this.dataSource as IWebProps),
      name: getTextContent(this.dataSource.name),
      desc: getTextContent(this.dataSource.desc),
    })
  }

  openMoveWebModal() {
    event.emit('MOVE_WEB', {
      indexs: this.indexs,
      data: [this.dataSource],
    })
  }

  get html() {
    return this.dataSource.desc.slice(1)
  }

  get getRate() {
    if (!this.dataSource.rate) {
      return null
    }
    const rate = Number(this.dataSource.rate)
    // 0分不显示
    if (!rate) {
      return null
    }
    return rate.toFixed(1) + '分'
  }
}
