// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.

import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { isLogin } from 'src/utils/user'
import { settings, internal } from 'src/store'
import { CommonService } from 'src/services/common'
import { ComponentGroupComponent } from 'src/components/component-group/index.component'
import { WebMoreMenuComponent } from 'src/components/web-more-menu/index.component'
import { SearchEngineComponent } from 'src/components/search-engine/search-engine.component'
import { NzSpinModule } from 'ng-zorro-antd/spin'
import { NzToolTipModule } from 'ng-zorro-antd/tooltip'
import { CardComponent } from 'src/components/card/index.component'
import { NoDataComponent } from 'src/components/no-data/no-data.component'
import { FooterComponent } from 'src/components/footer/footer.component'
import { FixbarComponent } from 'src/components/fixbar/index.component'
import { NzGridModule } from 'ng-zorro-antd/grid'
import { SwiperComponent } from 'src/components/swiper/index.component'
import { SafeHtmlPipe } from 'src/pipe/safeHtml.pipe'
import { ToolbarTitleWebComponent } from 'src/components/toolbar-title/index.component'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ToolbarTitleWebComponent,
    ComponentGroupComponent,
    WebMoreMenuComponent,
    SearchEngineComponent,
    NzSpinModule,
    NzToolTipModule,
    CardComponent,
    NoDataComponent,
    FooterComponent,
    FixbarComponent,
    NzGridModule,
    SwiperComponent,
    SafeHtmlPipe,
  ],
  selector: 'app-sim',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class SimComponent {
  description: string = settings.simThemeDesc.replace(
    '${total}',
    String(isLogin ? internal.loginViewCount : internal.userViewCount)
  )

  constructor(public commonService: CommonService) {}

  ngOnDestroy() {
    this.commonService.overIndex = Number.MAX_SAFE_INTEGER
  }

  ngAfterViewInit() {
    if (this.commonService.settings.simOverType === 'ellipsis') {
      this.commonService.getOverIndex('.top-nav .over-item')
    }
  }
}
