// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { settings } from 'src/store'
import config from '../../nav.config'

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
import { NzCarouselModule } from 'ng-zorro-antd/carousel'

// components
import { AppComponent } from './app.component'

// views
import LightComponent from '../view/index/light/index.component'
import SimComponent from '../view/index/sim/index.component'
import AdminComponent from '../view/admin/index.component'
import SystemComponent from '../view/system/index.component'
import SystemInfoComponent from '../view/system/info/index.component'
import SystemBookmarkComponent from '../view/system/bookmark/index.component'
import SystemAboutComponent from '../view/system/about/index.component'
import SystemTagComponent from '../view/system/tag/index.component'
import SystemSearchComponent from '../view/system/search/index.component'
import SystemSettingComponent from '../view/system/setting/index.component'
import SystemWebComponent from '../view/system/web/index.component'
import SideComponent from '../view/index/side/index.component'
import ShortcutComponent from '../view/index/shortcut/index.component'
import WebpComponent from '../view/app/default/app.component'
import { FixbarComponent } from '../components/fixbar/index.component'
import { FooterComponent } from '../components/footer/footer.component'
import { UploadComponent } from '../components/upload/index.component'
import { EllipsisComponent } from '../components/ellipsis/index.component'
import { IconGitComponent } from '../components/icon-git/icon-git.component'
import { NoDataComponent } from '../components/no-data/no-data.component'
import { SearchEngineComponent } from '../components/search-engine/search-engine.component';
import { LoginComponent } from '../components/login/login.component';
import { CreateWebComponent } from '../components/create-web/index.component';
import { ToolbarTitleWebComponent } from '../components/toolbar-title/index.component';
import { WebListComponent } from '../components/web-list/index.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LogoComponent } from '../components/logo/logo.component';
import { CardComponent } from '../components/card/index.component'
import { MoveSiteComponent } from '../components/move-site/index.component'

const appRoutes: Routes = [
  { 
    path: 'sim',
    component: SimComponent,
  },
  { 
    path: 'side',
    component: SideComponent,
  },
  { 
    path: 'shortcut',
    component: ShortcutComponent,
  },
  { 
    path: 'light',
    component: LightComponent,
    data: {
      renderLinear: true
    }
  },
  { 
    path: 'app',
    component: WebpComponent,
  },
  { 
    path: 'admin',
    component: AdminComponent,
  },
  { 
    path: 'system',
    component: SystemComponent,
    children: [
      {
        path: 'info',
        component: SystemInfoComponent
      },
      {
        path: 'bookmark',
        component: SystemBookmarkComponent
      },
      {
        path: 'about',
        component: SystemAboutComponent
      },
      {
        path: 'tag',
        component: SystemTagComponent
      },
      {
        path: 'search',
        component: SystemSearchComponent
      },
      {
        path: 'setting',
        component: SystemSettingComponent
      },
      {
        path: 'web',
        component: SystemWebComponent
      },
      {
        path: '**',
        redirectTo: '/system/web'
      },
    ]
  },
  {
    path: '**',
    redirectTo: '/' + settings.theme.toLowerCase(),
  },
]

@NgModule({
  declarations: [
    AppComponent,
    LightComponent,
    SimComponent,
    SideComponent,
    ShortcutComponent,
    AdminComponent,
    SystemComponent,
    SystemInfoComponent,
    SystemBookmarkComponent,
    SystemAboutComponent,
    SystemTagComponent,
    SystemSearchComponent,
    SystemSettingComponent,
    SystemWebComponent,
    WebpComponent,
    FixbarComponent,
    FooterComponent,
    UploadComponent,
    EllipsisComponent,
    IconGitComponent,
    NoDataComponent,
    SearchEngineComponent,
    LoginComponent,
    CreateWebComponent,
    ToolbarTitleWebComponent,
    WebListComponent,
    LogoComponent,
    CardComponent,
    MoveSiteComponent
  ],
  imports: [
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
    NzIconModule,
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
    NzCarouselModule,
    NzSwitchModule,
    DragDropModule,
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: false,     // <-- debugging purposes only
        useHash: config.hashMode,
      }
    ),
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],
  bootstrap: [
    AppComponent,
  ],
})

export class AppModule { }
