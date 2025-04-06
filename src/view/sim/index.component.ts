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
import { settings } from 'src/store'
import { compilerTemplate } from 'src/utils/utils'
import { scrollIntoView } from 'src/utils'
import { CommonService } from 'src/services/common'
import { ComponentGroupComponent } from 'src/components/component-group/index.component'
import { WebMoreMenuComponent } from 'src/components/web-more-menu/index.component'
import { SearchComponent } from 'src/components/search/index.component'
import { NzSpinModule } from 'ng-zorro-antd/spin'
import { NzToolTipModule } from 'ng-zorro-antd/tooltip'
import { CardComponent } from 'src/components/card/index.component'
import { NoDataComponent } from 'src/components/no-data/no-data.component'
import { FooterComponent } from 'src/components/footer/footer.component'
import { FixbarComponent } from 'src/components/fixbar/index.component'
import { SwiperComponent } from 'src/components/swiper/index.component'
import { SafeHtmlPipe } from 'src/pipe/safeHtml.pipe'
import { ToolbarTitleWebComponent } from 'src/components/toolbar-title/index.component'
import { ClassTabsComponent } from 'src/components/class-tabs/index.component'
import type { INavProps } from 'src/types'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ToolbarTitleWebComponent,
    ComponentGroupComponent,
    WebMoreMenuComponent,
    SearchComponent,
    NzSpinModule,
    NzToolTipModule,
    CardComponent,
    NoDataComponent,
    FooterComponent,
    FixbarComponent,
    SwiperComponent,
    SafeHtmlPipe,
    ClassTabsComponent,
  ],
  selector: 'app-sim',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class SimComponent {
  @ViewChild('parent') parentElement!: ElementRef
  @ViewChildren('item') items!: QueryList<ElementRef>

  readonly description: string = compilerTemplate(settings.simThemeDesc)

  constructor(public commonService: CommonService) {}

  ngOnDestroy() {
    this.commonService.setOverIndex()
  }

  get isEllipsis() {
    return this.commonService.settings.simOverType === 'ellipsis'
  }

  ngAfterViewInit() {
    if (this.isEllipsis) {
      this.commonService.getOverIndex('.top-nav .over-item')
    } else {
      scrollIntoView(
        this.parentElement.nativeElement,
        this.items.toArray()[this.commonService.oneIndex].nativeElement,
        {
          behavior: 'auto',
        }
      )
    }
  }

  handleClickTop(e: any, data: INavProps) {
    this.commonService.handleClickClass(data.id)
    if (!this.isEllipsis) {
      scrollIntoView(this.parentElement.nativeElement, e.target)
    }
  }
}
