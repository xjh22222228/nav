// 开源项目MIT，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息，允许商业途径。
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import config from '../../nav.config.json'
import { settings } from 'src/store'
import LightComponent from '../view/light/index.component'
import SuperComponent from '../view/super/index.component'
import SimComponent from '../view/sim/index.component'
import SystemComponent from '../view/system/index.component'
import SystemInfoComponent from '../view/system/info/index.component'
import SystemBookmarkComponent from '../view/system/bookmark/index.component'
import SystemBookmarkExportComponent from '../view/system/bookmark-export/index.component'
import SystemAboutComponent from '../view/system/about/index.component'
import SystemTagComponent from '../view/system/tag/index.component'
import SystemSearchComponent from '../view/system/search/index.component'
import SystemSettingComponent from '../view/system/setting/index.component'
import SystemWebComponent from '../view/system/web/index.component'
import SystemAngleMarkComponent from '../view/system/angle-mark/index.component'
import SideComponent from '../view/side/index.component'
import ShortcutComponent from '../view/shortcut/index.component'
import CollectComponent from '../view/system/collect/index.component'
import WebpComponent from '../view/app/default/app.component'
import VipAuthComponent from '../view/system/vip-auth/index.component'

const routes: Routes = [
  {
    path: 'sim',
    component: SimComponent,
  },
  {
    path: 'super',
    component: SuperComponent,
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
      renderLinear: true,
    },
  },
  {
    path: 'app',
    component: WebpComponent,
  },
  {
    path: 'system',
    component: SystemComponent,
    children: [
      {
        path: 'info',
        component: SystemInfoComponent,
      },
      {
        path: 'bookmark',
        component: SystemBookmarkComponent,
      },
      {
        path: 'bookmarkExport',
        component: SystemBookmarkExportComponent,
      },
      {
        path: 'collect',
        component: CollectComponent,
      },
      {
        path: 'vip',
        component: VipAuthComponent,
      },
      {
        path: 'about',
        component: SystemAboutComponent,
      },
      {
        path: 'tag',
        component: SystemTagComponent,
      },
      {
        path: 'search',
        component: SystemSearchComponent,
      },
      {
        path: 'setting',
        component: SystemSettingComponent,
      },
      {
        path: 'angle',
        component: SystemAngleMarkComponent,
      },
      {
        path: 'web',
        component: SystemWebComponent,
      },
      {
        path: '**',
        redirectTo: '/system/web',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/' + settings.theme.toLowerCase(),
  },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: config.hashMode,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
