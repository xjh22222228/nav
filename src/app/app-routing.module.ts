// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import config from '../../nav.config.json'
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
import SystemWebComponent from '../view/system/web/index.component'
import SystemComponentComponent from '../view/system/component/index.component'
import SideComponent from '../view/side/index.component'
import ShortcutComponent from '../view/shortcut/index.component'
import CollectComponent from '../view/system/collect/index.component'
import WebpComponent from '../view/app/default/app.component'
import VipAuthComponent from '../view/system/vip-auth/index.component'
import { isSelfDevelop } from 'src/utils/util'
import { getDefaultTheme } from 'src/utils'

export const routes: Routes = [
  {
    path: 'sim',
    component: SimComponent,
    data: {},
  },
  {
    path: 'super',
    component: SuperComponent,
    data: {},
  },
  {
    path: 'side',
    component: SideComponent,
    data: {},
  },
  {
    path: 'shortcut',
    component: ShortcutComponent,
    data: {},
  },

  {
    path: 'light',
    component: LightComponent,
    data: {
      renderLinear: true,
      data: {},
    },
  },
  {
    path: 'app',
    component: WebpComponent,
    data: {},
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
        path: 'component',
        component: SystemComponentComponent,
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
]

// 自有部署异步
if (!isSelfDevelop) {
  const defaultTheme = getDefaultTheme().toLowerCase()
  const hasDefault = routes.find((item) => item.path === defaultTheme)
  if (hasDefault) {
    routes.push({
      ...hasDefault,
      path: '**',
    })
  } else {
    routes.push({
      path: '**',
      redirectTo: '/' + defaultTheme,
    })
  }
}

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: config.hashMode,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
