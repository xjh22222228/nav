import { Routes } from '@angular/router'
import LightComponent from 'src/view/light/index.component'
import SuperComponent from 'src/view/super/index.component'
import SimComponent from 'src/view/sim/index.component'
import SideComponent from 'src/view/side/index.component'
import ShortcutComponent from 'src/view/shortcut/index.component'
import WebpComponent from 'src/view/app/default/app.component'
import { isSelfDevelop } from 'src/utils/utils'
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
    loadComponent: () => import('src/view/system/index.component'),
    children: [
      {
        path: 'info',
        loadComponent: () => import('src/view/system/info/index.component'),
      },
      {
        path: 'bookmark',
        loadComponent: () => import('src/view/system/bookmark/index.component'),
      },
      {
        path: 'bookmarkExport',
        loadComponent: () =>
          import('src/view/system/bookmark-export/index.component'),
      },
      {
        path: 'collect',
        loadComponent: () => import('src/view/system/collect/index.component'),
      },
      {
        path: 'auth',
        loadComponent: () => import('src/view/system/auth/index.component'),
      },
      {
        path: 'tag',
        loadComponent: () => import('src/view/system/tag/index.component'),
      },
      {
        path: 'search',
        loadComponent: () => import('src/view/system/search/index.component'),
      },
      {
        path: 'setting',
        loadComponent: () => import('src/view/system/setting/index.component'),
      },
      {
        path: 'component',
        loadComponent: () =>
          import('src/view/system/component/index.component'),
      },
      {
        path: 'web',
        loadComponent: () => import('src/view/system/web/index.component'),
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
