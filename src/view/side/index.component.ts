// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { $t } from 'src/locale'
import { CommonService } from 'src/services/common'
import { ComponentGroupComponent } from 'src/components/component-group/index.component'
import { SearchComponent } from 'src/components/search/index.component'
import { NzSpinModule } from 'ng-zorro-antd/spin'
import { CardComponent } from 'src/components/card/index.component'
import { NoDataComponent } from 'src/components/no-data/no-data.component'
import { FooterComponent } from 'src/components/footer/footer.component'
import { FixbarComponent } from 'src/components/fixbar/index.component'
import { SwiperComponent } from 'src/components/swiper/index.component'
import { ToolbarTitleWebComponent } from 'src/components/toolbar-title/index.component'
import { WebListComponent } from 'src/components/web-list/index.component'
import { ClassTabsComponent } from 'src/components/class-tabs/index.component'
import { SidebarComponent } from 'src/components/sidebar/index.component'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    WebListComponent,
    ToolbarTitleWebComponent,
    ComponentGroupComponent,
    SearchComponent,
    NzSpinModule,
    CardComponent,
    NoDataComponent,
    FooterComponent,
    FixbarComponent,
    SwiperComponent,
    ClassTabsComponent,
    SidebarComponent,
  ],
  selector: 'app-side',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export default class SideComponent {
  readonly $t = $t

  constructor(public commonService: CommonService) {}
}
