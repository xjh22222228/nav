// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { registerLocaleData } from '@angular/common'
import zh from '@angular/common/locales/zh'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { FormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { NzModalModule } from 'ng-zorro-antd/modal'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzRadioModule } from 'ng-zorro-antd/radio'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { NzMessageModule } from 'ng-zorro-antd/message'
import { NzNotificationModule } from 'ng-zorro-antd/notification'
import { NzFormModule } from 'ng-zorro-antd/form'
import { NzEmptyModule } from 'ng-zorro-antd/empty'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { ReactiveFormsModule } from '@angular/forms'
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm'
import { NzDropDownModule } from 'ng-zorro-antd/dropdown'
import { NzToolTipModule } from 'ng-zorro-antd/tooltip'
import { NzCardModule } from 'ng-zorro-antd/card'
import { NzIconModule } from 'ng-zorro-antd/icon'
import { NzGridModule } from 'ng-zorro-antd/grid'
import { NzLayoutModule } from 'ng-zorro-antd/layout'
import { NzMenuModule } from 'ng-zorro-antd/menu'
import { NzTableModule } from 'ng-zorro-antd/table'
import { NzTabsModule } from 'ng-zorro-antd/tabs'
import { NzTagModule } from 'ng-zorro-antd/tag'
import { NzRateModule } from 'ng-zorro-antd/rate'
import { NzSwitchModule } from 'ng-zorro-antd/switch'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox'
import { NzPopoverModule } from 'ng-zorro-antd/popover'
import { NzSliderModule } from 'ng-zorro-antd/slider'
import { IconDefinition } from '@ant-design/icons-angular'
import { NzSpinModule } from 'ng-zorro-antd/spin'
import { NzDrawerModule } from 'ng-zorro-antd/drawer'
import { NzColorPickerModule } from 'ng-zorro-antd/color-picker'
import { NzCarouselModule } from 'ng-zorro-antd/carousel'
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker'
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker'

import { NZ_I18N } from 'ng-zorro-antd/i18n'
import { zh_CN } from 'ng-zorro-antd/i18n'

import { SwiperComponent } from '../components/swiper/index.component'
import { FixbarComponent } from '../components/fixbar/index.component'
import { FooterComponent } from '../components/footer/footer.component'
import { UploadComponent } from '../components/upload/index.component'
import { IconGitComponent } from '../components/icon-git/icon-git.component'
import { NoDataComponent } from '../components/no-data/no-data.component'
import { SearchEngineComponent } from '../components/search-engine/search-engine.component'
import { LoginComponent } from '../components/login/login.component'
import { CreateWebComponent } from '../components/create-web/index.component'
import { ToolbarTitleWebComponent } from '../components/toolbar-title/index.component'
import { WebListComponent } from '../components/web-list/index.component'
import { LogoComponent } from '../components/logo/logo.component'
import { CardComponent } from '../components/card/index.component'
import { MoveWebComponent } from '../components/move-web/index.component'
import { WebMoreMenuComponent } from '../components/web-more-menu/index.component'
import { TagListComponent } from '../components/tag-list/index.component'
import { CalendarComponent } from '../components/calendar/index.component'
import { CalendarDrawerComponent } from '../components/calendar/drawer/index.component'
import { ComponentGroupComponent } from '../components/component-group/index.component'
import { RuntimeComponent } from '../components/runtime/index.component'
import { RuntimeDrawerComponent } from '../components/runtime/drawer/index.component'
import { OffWorkComponent } from '../components/off-work/index.component'
import { OffWorkDrawerComponent } from '../components/off-work/drawer/index.component'
import { ImageComponent } from '../components/image/index.component'
import { ImageDrawerComponent } from '../components/image/drawer/index.component'
import { CountdownComponent } from '../components/countdown/index.component'
import { CountdownDrawerComponent } from '../components/countdown/drawer/index.component'

import LightComponent from '../view/light/index.component'
import SuperComponent from '../view/super/index.component'
import SimComponent from '../view/sim/index.component'
import SystemComponent from '../view/system/index.component'
import SystemInfoComponent from '../view/system/info/index.component'
import SystemBookmarkComponent from '../view/system/bookmark/index.component'
import SystemBookmarkExportComponent from '../view/system/bookmark-export/index.component'
import SystemTagComponent from '../view/system/tag/index.component'
import SystemSearchComponent from '../view/system/search/index.component'
import SystemSettingComponent from '../view/system/setting/index.component'
import CollectComponent from '../view/system/collect/index.component'
import SystemWebComponent from '../view/system/web/index.component'
import SystemComponentComponent from '../view/system/component/index.component'
import SideComponent from '../view/side/index.component'
import ShortcutComponent from '../view/shortcut/index.component'
import WebpComponent from '../view/app/default/app.component'
import VipAuthComponent from '../view/system/vip-auth/index.component'

import { SafeHtmlPipe } from 'src/pipe/safeHtml.pipe'
import { CommonService } from 'src/services/common'
import { JumpService } from 'src/services/jump'

import {
  CheckOutline,
  CopyOutline,
  ShareAltOutline,
  EllipsisOutline,
  LoadingOutline,
  UploadOutline,
  MinusOutline,
  PlusOutline,
  StopOutline,
} from '@ant-design/icons-angular/icons'

registerLocaleData(zh)

const icons: IconDefinition[] = [
  CheckOutline,
  CopyOutline,
  ShareAltOutline,
  EllipsisOutline,
  LoadingOutline,
  UploadOutline,
  MinusOutline,
  PlusOutline,
  StopOutline,
]

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    LightComponent,
    SuperComponent,
    SimComponent,
    SideComponent,
    ShortcutComponent,
    SystemComponent,
    SystemInfoComponent,
    SystemBookmarkComponent,
    SystemBookmarkExportComponent,
    SystemTagComponent,
    SystemSearchComponent,
    SystemSettingComponent,
    CollectComponent,
    SystemWebComponent,
    SystemComponentComponent,
    WebpComponent,
    VipAuthComponent,
    SwiperComponent,
    FixbarComponent,
    FooterComponent,
    UploadComponent,
    IconGitComponent,
    NoDataComponent,
    SearchEngineComponent,
    LoginComponent,
    CreateWebComponent,
    ToolbarTitleWebComponent,
    WebListComponent,
    LogoComponent,
    CardComponent,
    MoveWebComponent,
    WebMoreMenuComponent,
    TagListComponent,
    CalendarComponent,
    RuntimeComponent,
    RuntimeDrawerComponent,
    OffWorkComponent,
    ImageComponent,
    ImageDrawerComponent,
    CountdownComponent,
    CountdownDrawerComponent,
    OffWorkDrawerComponent,
    CalendarDrawerComponent,
    ComponentGroupComponent,
    SafeHtmlPipe,
  ],
  imports: [
    BrowserAnimationsModule,
    NzModalModule,
    NzInputModule,
    NzRadioModule,
    NzSelectModule,
    NzMessageModule,
    NzNotificationModule,
    NzFormModule,
    NzEmptyModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzPopconfirmModule,
    NzDropDownModule,
    NzToolTipModule,
    NzCardModule,
    NzIconModule.forRoot(icons),
    NzGridModule,
    NzLayoutModule,
    NzMenuModule,
    NzTableModule,
    NzTabsModule,
    NzTagModule,
    NzRateModule,
    NzCheckboxModule,
    NzPopoverModule,
    NzSliderModule,
    NzSpinModule,
    NzDrawerModule,
    NzColorPickerModule,
    NzCarouselModule,
    NzTimePickerModule,
    NzDatePickerModule,
    NzSwitchModule,
    DragDropModule,
    BrowserModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    CommonService,
    JumpService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
