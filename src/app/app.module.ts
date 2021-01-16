// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.

import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { FormsModule } from '@angular/forms'
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
import { NzAvatarModule } from 'ng-zorro-antd/avatar'
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm'

// components
import { AppComponent } from './app.component'

// views
import LightComponent from '../view/index/light/index.component'
import SimComponent from '../view/index/sim/index.component'
import WebpComponent from '../view/app/default/app.component'
import { FixbarComponent } from '../components/fixbar/index.component'
import { MultipleSiteComponent } from '../components/multiple-site/index.component'
import { FooterComponent } from '../components/footer/footer.component'
import { IconGitComponent } from '../components/icon-git/icon-git.component'
import { NoDataComponent } from '../components/no-data/no-data.component'
import { SearchEngineComponent } from '../components/search-engine/search-engine.component';
import { CreateComponent } from '../components/create/create.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LogoComponent } from '../components/logo/logo.component';
import { DelComponent } from '../components/del/del.component'

registerLocaleData(zh);

const appRoutes: Routes = [
  { 
    path: 'sim',
    component: SimComponent,
  },
  { 
    path: 'light',
    component: LightComponent,
  },
  { 
    path: 'app',
    component: WebpComponent,
  },
  {
    path: '**',
    redirectTo: '/' + config.theme,
  },
]


@NgModule({
  declarations: [
    AppComponent,
    LightComponent,
    SimComponent,
    WebpComponent,
    FixbarComponent,
    MultipleSiteComponent,
    FooterComponent,
    IconGitComponent,
    NoDataComponent,
    SearchEngineComponent,
    CreateComponent,
    LogoComponent,
    DelComponent
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
    NzAvatarModule,
    NzPopconfirmModule,
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: false,     // <-- debugging purposes only
        useHash: true,
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
