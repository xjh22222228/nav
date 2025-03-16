// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, Input, ViewChild, ElementRef } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { isLogin, getPermissions } from 'src/utils/user'
import { copyText, getTextContent } from 'src/utils'
import { parseHtmlWithContent, parseLoadingWithContent } from 'src/utils/utils'
import { setWebsiteList } from 'src/utils/web'
import type { INavProps, IWebProps, ICardType } from 'src/types'
import { ActionType } from 'src/types'
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
import { saveUserCollect } from 'src/api'
import { NzMessageService } from 'ng-zorro-antd/message'
import { CommonService } from 'src/services/common'
import { CODE_SYMBOL } from 'src/constants/symbol'
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
export class CardComponent {
  @Input() dataSource!: IWebProps
  @Input() cardStyle: ICardType = 'standard'
  @ViewChild('root', { static: false }) root!: ElementRef

  readonly $t = $t
  readonly settings = settings
  readonly websiteList: INavProps[] = websiteList
  readonly isLogin = isLogin
  readonly permissions = getPermissions(settings)
  copyUrlDone = false
  copyPathDone = false
  description = ''
  isCode = false

  constructor(
    public commonService: CommonService,
    public readonly jumpService: JumpService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.isCode = this.dataSource.desc?.[0] === CODE_SYMBOL
    this.description = parseLoadingWithContent(this.dataSource.desc)
  }

  ngAfterViewInit() {
    this.parseDescription()
  }

  private parseDescription() {
    parseHtmlWithContent(this.root?.nativeElement, this.dataSource.desc)
  }

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

  async confirmDel(): Promise<void> {
    const params: IWebProps = {
      ...(this.dataSource as IWebProps),
      name: getTextContent(this.dataSource.name),
      desc: getTextContent(this.dataSource.desc),
    }
    if (isLogin) {
      this.commonService.deleteWebByIds([params.id], params)
    } else {
      event.emit('MODAL', {
        nzTitle: $t('_confirmDel'),
        nzContent: `ID: ${params.id}`,
        nzWidth: 350,
        nzOkType: 'primary',
        nzOkDanger: true,
        nzOkText: $t('_del'),
        nzOnOk: async () => {
          await saveUserCollect({
            data: {
              ...params,
              extra: {
                type: ActionType.Delete,
              },
            },
          })
          this.message.success($t('_waitHandle'))
        },
      })
    }
  }

  openMoveWebModal(): void {
    event.emit('MOVE_WEB', {
      data: [this.dataSource],
    })
  }

  get getRate(): string {
    const rate = Number(this.dataSource.rate ?? 0)
    return rate > 0 ? `${rate.toFixed(1)}${isZhCN() ? '分' : ''}` : ''
  }
}
