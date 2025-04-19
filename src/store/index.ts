// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

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

export let settings: ISettings = settingsJson as ISettings

let _tagMap: Record<string, ITagPropValues> = {}

export let search: ISearchProps = isSelfDevelop
  ? ({} as ISearchProps)
  : searchJson

export let tagList: Array<ITagPropValues> = isSelfDevelop ? [] : tagJson

export function getTagMap() {
  tagList.forEach((item) => {
    if (item.id) {
      _tagMap[item.id] = {
        ...item,
      }
    }
  })
  return _tagMap
}
getTagMap()

export let tagMap: ITagProp = _tagMap

export let internal: InternalProps = internalJson

export let websiteList: INavProps[] = isSelfDevelop
  ? []
  : (dbJson as INavProps[])

export let component: IComponentProps = isSelfDevelop
  ? { zoom: 1, components: [] }
  : componentJson
