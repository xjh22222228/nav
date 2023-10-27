import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import config from '../../nav.config'
import { settings } from 'src/store'
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
import SystemAngleMarkComponent from '../view/system/angle-mark/index.component'
import SideComponent from '../view/index/side/index.component'
import ShortcutComponent from '../view/index/shortcut/index.component'
import WebpComponent from '../view/app/default/app.component'

const routes: Routes = [
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
        path: 'angle',
        component: SystemAngleMarkComponent
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: config.hashMode,
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
