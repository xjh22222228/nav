// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { $t } from 'src/locale'
import { NewsType } from 'src/types'

export const newsTypeMap = {
  [NewsType.Weibo]: $t('_weibo'),
  [NewsType.V2ex]: 'V2EX',
  [NewsType.Douyin]: $t('_douyin'),
  [NewsType.Bilibili]: $t('_bilibili'),
  [NewsType.Juejin]: $t('_juejin'),
  [NewsType.Baidu]: $t('_baidu'),
  [NewsType.GitHub]: 'GitHub',
  [NewsType.Pojie52]: $t('_52'),
  [NewsType.Xiaohongshu]: $t('_hongshu'),
  [NewsType.Toutiao]: $t('_toutiao'),
  [NewsType.Douban]: $t('_douban'),
  [NewsType.HackerNews]: 'Hacker News',
  [NewsType.Zhihu]: $t('_zhihu'),
  [NewsType.ZhihuDaily]: $t('_zhihuDaily'),
} as const
