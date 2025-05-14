// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav
import { signal, computed } from '@angular/core'
import dbJson from '../../data/db.json'
import searchJson from '../../data/search.json'
import settingsJson from '../../data/settings.json'
import tagJson from '../../data/tag.json'
import internalJson from '../../data/internal.json'
import componentJson from '../../data/component.json'
import type {
  ISettings,
  ISearchProps,
  ITagProp,
  InternalProps,
  ITagPropValues,
  INavProps,
  IComponentProps,
} from 'src/types'
import { isSelfDevelop } from 'src/utils/utils'

export const settings = signal<ISettings>(settingsJson as ISettings)

export const search = signal<ISearchProps>(
  isSelfDevelop ? ({} as ISearchProps) : searchJson,
)

export const tagList = signal<Array<ITagPropValues>>(
  isSelfDevelop ? [] : tagJson,
)

export const tagMap = computed<ITagProp>(() => {
  const map: ITagProp = {}
  tagList().forEach((item) => {
    if (item.id) {
      map[item.id] = {
        ...item,
      }
    }
  })
  return map
})

export const internal = signal<InternalProps>(internalJson)

export const navs = signal<INavProps[]>(
  isSelfDevelop ? [] : (dbJson as INavProps[]),
)

export const component = signal<IComponentProps>(
  isSelfDevelop ? { zoom: 1, components: [] } : componentJson,
)
