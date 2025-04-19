import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import { registerLocaleData } from '@angular/common'
import zh from '@angular/common/locales/zh'
import { provideRouter, withHashLocation } from '@angular/router'
import { provideNzIcons } from 'ng-zorro-antd/icon'
import { IconDefinition } from '@ant-design/icons-angular'
import { routes } from './app.routes'
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
  MenuFoldOutline,
  MenuUnfoldOutline,
  DoubleRightOutline,
  DoubleLeftOutline,
} from '@ant-design/icons-angular/icons'
import { provideAnimations } from '@angular/platform-browser/animations'
import { NZ_I18N } from 'ng-zorro-antd/i18n'
import { zh_CN } from 'ng-zorro-antd/i18n'
import config from '../../nav.config.json'

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
  MenuFoldOutline,
  MenuUnfoldOutline,
  DoubleRightOutline,
  DoubleLeftOutline,
]

const isHashMode = window.__HASH_MODE__ ?? config.hashMode

export const appConfig: ApplicationConfig = {
  providers: [
    provideNzIcons(icons),
    provideZoneChangeDetection({ eventCoalescing: true }),
    isHashMode
      ? provideRouter(routes, withHashLocation())
      : provideRouter(routes),
    provideAnimations(),
    { provide: NZ_I18N, useValue: zh_CN },
  ],
}
