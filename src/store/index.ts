// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.

import { websiteList as w } from '../utils'
import * as __settings from '../../data/settings.json'
import * as s from '../../data/search.json'
import * as __tag from '../../data/tag.json'
import * as __internal from '../../data/internal.json'
import {
  ISettings,
  ISearchEngineProps,
  ITagProp,
  internalProps,
} from 'src/types'

export const settings: ISettings = {
  ...(__settings as any).default,
  actionUrl: '',
}

export const searchEngineList: ISearchEngineProps[] = (s as any).default

export const tagMap: ITagProp = (__tag as any).default

export const internal: internalProps = (__internal as any).default

export const websiteList = w
