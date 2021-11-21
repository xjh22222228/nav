// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.

import { websiteList as w } from '../utils'
import * as __settings from '../../data/settings.json'
import * as s from '../../data/search.json'
import * as __tag from '../../data/tag.json'
import { ISettings, ISearchEngineProps, ITagProp } from 'src/types'

export const settings: ISettings = (__settings as any).default

export const searchEngineList: ISearchEngineProps[] = (s as any).default

export const tagMap: ITagProp = (__tag as any).default

export const websiteList = w
