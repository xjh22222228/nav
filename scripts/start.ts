// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present x.iejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import fs from 'fs'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
import defaultDb from './db'
import LZString from 'lz-string'
import {
  TAG_ID1,
  TAG_ID2,
  TAG_ID3,
  TAG_ID_NAME1,
  TAG_ID_NAME2,
  TAG_ID_NAME3,
  getWebCount,
  setWebs,
  PATHS,
  getConfig,
  fileWriteStream,
} from './utils'
import { replaceJsdelivrCDN } from '../src/utils/pureUtils'
import type {
  ITagPropValues,
  ISettings,
  INavProps,
  InternalProps,
  IComponentProps,
  ISearchProps,
} from '../src/types/index'
import { ComponentType } from '../src/types/index'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Shanghai')

const getWebs = (): INavProps[] => {
  try {
    const strings = fs.readFileSync(PATHS.db).toString().trim()
    if (!strings) throw new Error('empty')

    try {
      const serverdb = fs.readFileSync(PATHS.serverdb).toString().trim()
      return JSON.parse(serverdb)
    } catch {}

    return strings[0] === '['
      ? JSON.parse(strings)
      : JSON.parse(LZString.decompressFromBase64(strings)) ||
          JSON.parse(LZString.decompressFromBase64(defaultDb))
  } catch {
    return JSON.parse(LZString.decompressFromBase64(defaultDb))
  }
}

const main = async () => {
  const configJson = getConfig()
  fs.writeFileSync(PATHS.configJson, JSON.stringify(configJson))

  const db = getWebs()
  let internal = {} as InternalProps
  let settings = {} as ISettings
  let tags: ITagPropValues[] = []
  let search = {} as ISearchProps
  let component: IComponentProps = { zoom: 1, components: [] }

  try {
    internal = JSON.parse(fs.readFileSync(PATHS.internal).toString())
    settings = JSON.parse(fs.readFileSync(PATHS.settings).toString())
    tags = JSON.parse(fs.readFileSync(PATHS.tag).toString())
  } catch (e: any) {
    console.log(e.message)
  }

  try {
    const s = JSON.parse(fs.readFileSync(PATHS.search).toString())
    if (Array.isArray(s)) {
      // @ts-ignore
      search = {
        list: s,
      }
    } else {
      search = s
    }
  } catch {
  } finally {
    if (!search.list || !search.list.length) {
      search.list = [
        {
          name: '站内',
          icon:
            settings.favicon ||
            'https://gcore.jsdelivr.net/gh/xjh22222228/public@gh-pages/nav/logo.svg',
          placeholder: '站内搜索',
          blocked: false,
          isInner: true,
        },
        {
          name: 'Google',
          url: 'https://www.google.com/search?q=',
          icon: 'https://www.google.com/favicon.ico',
          blocked: false,
          isInner: false,
        },
      ]
    }
    search.logo ||= ''
    search.darkLogo ||= ''
    search.height ||= 80
    search.list = search.list.map((item) => {
      item.icon = replaceJsdelivrCDN(item.icon, settings)
      return item
    })
    fs.writeFileSync(PATHS.search, JSON.stringify(search), {
      encoding: 'utf-8',
    })
  }

  try {
    const components = JSON.parse(fs.readFileSync(PATHS.component).toString())
    // < 16
    if (Array.isArray(components)) {
      component = {
        zoom: 1,
        components,
      }
    } else {
      component = components
    }
  } catch {
  } finally {
    let idx = component.components.findIndex(
      (item) => item['type'] === ComponentType.Calendar
    )
    const calendar = {
      type: ComponentType.Calendar,
      id: -ComponentType.Calendar,
      topColor: '#ff5a5d',
      bgColor: '#1d1d1d',
    }
    if (idx >= 0) {
      component.components[idx] = {
        ...calendar,
        ...component.components[idx],
      }
    } else {
      component.components.push(calendar)
    }
    //
    idx = component.components.findIndex(
      (item) => item['type'] === ComponentType.OffWork
    )
    const offWork = {
      type: ComponentType.OffWork,
      id: -ComponentType.OffWork,
      workTitle: '距离下班还有',
      restTitle: '休息啦',
      startDate: new Date(2018, 3, 26, 9, 0, 0).getTime(),
      date: new Date(2018, 3, 26, 18, 0, 0).getTime(),
    }
    if (idx >= 0) {
      component.components[idx] = {
        ...offWork,
        ...component.components[idx],
      }
    } else {
      component.components.push(offWork)
    }
    //
    idx = component.components.findIndex(
      (item) => item['type'] === ComponentType.Image
    )
    const image = {
      type: ComponentType.Image,
      id: -ComponentType.Image,
      url: 'https://gcore.jsdelivr.net/gh/xjh22222228/public@gh-pages/nav/component1.jpg',
      go: '',
      text: '只有认可，才能强大',
    }
    if (idx >= 0) {
      component.components[idx] = {
        ...image,
        ...component.components[idx],
      }
      component.components[idx]['url'] = replaceJsdelivrCDN(
        component.components[idx]['url'],
        settings
      )
    } else {
      component.components.push(image)
    }
    //
    idx = component.components.findIndex(
      (item) => item['type'] === ComponentType.Countdown
    )
    const countdown = {
      type: ComponentType.Countdown,
      id: -ComponentType.Countdown,
      topColor: 'linear-gradient(90deg, #FAD961 0%, #F76B1C 100%)',
      bgColor: 'rgb(235,129,124)',
      url: 'https://gcore.jsdelivr.net/gh/xjh22222228/public@gh-pages/nav/component2.jpg',
      title: '距离春节还有',
      dateColor: '#fff',
      dayColor: '#fff',
      date: '2026-02-17',
    }
    if (idx >= 0) {
      component.components[idx] = {
        ...countdown,
        ...component.components[idx],
      }
      component.components[idx]['url'] = replaceJsdelivrCDN(
        component.components[idx]['url'],
        settings
      )
    } else {
      component.components.push(countdown)
    }
    //
    idx = component.components.findIndex(
      (item) => item['type'] === ComponentType.Runtime
    )
    const runtime = {
      type: ComponentType.Runtime,
      id: -ComponentType.Runtime,
      title: '已稳定运行',
    }
    if (idx >= 0) {
      component.components[idx] = {
        ...runtime,
        ...component.components[idx],
      }
    } else {
      component.components.push(runtime)
    }
    //
    idx = component.components.findIndex(
      (item) => item['type'] === ComponentType.HTML
    )
    const html = {
      type: ComponentType.HTML,
      id: -ComponentType.HTML,
      html: '你好，发现导航',
      width: 160,
      bgColor: '#fff',
    }
    if (idx >= 0) {
      component.components[idx] = {
        ...html,
        ...component.components[idx],
      }
    } else {
      component.components.push(html)
    }
    //
    idx = component.components.findIndex(
      (item) => item['type'] === ComponentType.Holiday
    )
    const holiday = {
      type: ComponentType.Holiday,
      id: -ComponentType.Holiday,
      items: [],
    }
    if (idx >= 0) {
      component.components[idx] = {
        ...holiday,
        ...component.components[idx],
      }
    } else {
      component.components.push(holiday)
    }
    //
    idx = component.components.findIndex(
      (item) => item['type'] === ComponentType.News
    )
    const news = {
      type: ComponentType.News,
      id: -ComponentType.News,
      bgColor: 'linear-gradient(100deg,#2a2d38, rgb(35, 39, 54))',
      types: [],
      count: 0,
    }
    if (idx >= 0) {
      component.components[idx] = {
        ...news,
        ...component.components[idx],
      }
    } else {
      component.components.push(news)
    }
    fs.writeFileSync(PATHS.component, JSON.stringify(component))
  }

  {
    const isEn = settings.language === 'en'
    const desc = isEn ? 'The system is built-in' : '系统内置不可删除'
    if (!Array.isArray(tags)) {
      tags = []
    }
    const a = tags.some((item) => item.id === TAG_ID1)
    if (!a) {
      tags.push({
        id: TAG_ID1,
        name: isEn ? 'Chinese' : TAG_ID_NAME1,
        color: '#2db7f5',
        desc,
        isInner: true,
      })
    }
    const b = tags.some((item) => item.id === TAG_ID2)
    if (!b) {
      tags.push({
        id: TAG_ID2,
        name: isEn ? 'English' : TAG_ID_NAME2,
        color: '#f50',
        desc,
        isInner: true,
      })
    }
    const c = tags.some((item) => item.id === TAG_ID3)
    if (!c) {
      tags.push({
        id: TAG_ID3,
        name: TAG_ID_NAME3,
        color: '#108ee9',
        desc,
        isInner: true,
      })
    }
    tags = tags.filter((item) => item.name && item.id)
    fs.writeFileSync(PATHS.tag, JSON.stringify(tags), {
      encoding: 'utf-8',
    })
  }

  {
    const banner1 =
      'https://gcore.jsdelivr.net/gh/xjh22222228/public@gh-pages/nav/banner1.jpg'
    const banner2 =
      'https://gcore.jsdelivr.net/gh/xjh22222228/public@gh-pages/nav/banner2.jpg'
    const backgroundImg =
      'https://gcore.jsdelivr.net/gh/xjh22222228/public@gh-pages/nav/background.jpg'

    settings.favicon ??=
      'https://gcore.jsdelivr.net/gh/xjh22222228/public@gh-pages/nav/logo.svg'
    settings.language ||= 'zh-CN'
    settings.loading ??= 'random'
    settings.runtime ??= dayjs.tz().valueOf()
    settings.userActions ||= []
    settings.email ||= configJson.email || ''
    settings.showGithub ??= true
    settings.showLanguage ??= true
    settings.showRate ??= true
    settings.openSearch ??= true
    settings.title ??= '发现导航 - 精选实用导航网站'
    settings.description ??= '发现导航是一个轻量级免费且强大的导航网站'
    settings.keywords ??= '免费导航,开源导航'
    settings.theme ??= 'Light'
    settings.actionUrl ??= ''
    settings.appTheme ??= 'Current'
    settings.openSEO ??= !configJson.address
    settings.createWebKey ??= 'E'
    settings.headerContent ??= ''
    settings.footerContent ??= `
<div class="dark-white">
  <div>共收录$\{total\}个网站</div>
  <div>Copyright © 2018-$\{year} $\{hostname}, All Rights Reserved</div>  
</div>
`.trim()
    settings.showThemeToggle ??= true
    settings.logo ||= ''
    settings.darkLogo ||= ''

    settings.lightDocTitle ||= ''
    settings.lightCardStyle ||= 'standard'
    settings.lightOverType ||= 'overflow'
    settings.lightFooterHTML ||= ''
    settings.simThemeImages ||= [
      {
        src: banner1,
        url: 'https://github.com/xjh22222228/nav',
      },
      {
        src: banner2,
        url: 'https://github.com/xjh22222228/nav',
      },
    ]
    settings.simThemeDesc ??=
      '这里收录多达 <b>${total}</b> 个优质网站， 助您工作、学习和生活'
    settings.simCardStyle ||= 'original'
    settings.simOverType ||= 'overflow'
    settings.simThemeHeight ??= 0
    settings.simThemeAutoplay ??= true
    settings.simDocTitle ||= ''
    settings.simTitle ||= ''
    settings.simFooterHTML ||= ''
    settings.superCardStyle ||= 'column'
    settings.superOverType ||= 'overflow'
    settings.superFooterHTML ||= ''

    settings.superDocTitle ||= ''
    settings.superTitle ||= ''
    const defImgs = [
      {
        src: 'https://gcore.jsdelivr.net/gh/xjh22222228/nav-image@image/nav-1717494364392-ad.jpg',
        url: 'https://haokawx.lot-ml.com/Product/index/454266',
      },
      {
        src: 'https://gcore.jsdelivr.net/gh/xjh22222228/public@gh-pages/img/10.png',
        url: '',
      },
    ]
    settings.superImages ??= defImgs
    settings.lightImages ??= defImgs
    if (!Array.isArray(settings.superImages)) {
      settings.superImages = defImgs
    }
    if (!Array.isArray(settings.lightImages)) {
      settings.lightImages = defImgs
    }
    settings.sideTitle ||= ''
    settings.sideDocTitle ||= ''
    settings.sideCardStyle ||= 'example'
    settings.sideFooterHTML ||= ''
    settings.sideThemeHeight ??= 0
    settings.sideThemeAutoplay ??= true
    settings.sideCollapsed ??= false
    settings.sideThemeImages ||= [
      {
        src: banner2,
        url: 'https://github.com/xjh22222228/nav',
      },
      {
        src: banner1,
        url: 'https://github.com/xjh22222228/nav',
      },
    ]
    settings.shortcutTitle ??= ''
    settings.shortcutDocTitle ||= ''
    settings.shortcutDockCount ??= 6
    settings.shortcutThemeShowWeather ??= true
    settings.shortcutThemeImages ??= [
      {
        src: backgroundImg,
        url: '',
      },
    ]
    settings.checkUrl ??= false
    settings.spiderIcon ??= 'NO'
    settings.spiderDescription ??= 'NO'
    settings.spiderTitle ??= 'NO'
    settings.spiderImg ??= 'NO'
    settings.spiderQty ??= 200
    settings.spiderTimeout ??= 6
    settings.spiderTimeout = Number(settings.spiderTimeout) || 6
    settings.loadingCode ??= ''

    settings.appCardStyle ??= 'retro'
    settings.appDocTitle ||= ''
    settings.gitHubCDN ||= 'gcore.jsdelivr.net'
    settings.components ||= []

    // 替换CDN
    settings.favicon = replaceJsdelivrCDN(settings.favicon, settings)
    settings.simThemeImages = settings.simThemeImages.map((item) => {
      item.src = replaceJsdelivrCDN(item.src, settings)
      return item
    })
    settings.superImages = settings.superImages.map((item) => {
      item.src = replaceJsdelivrCDN(item.src, settings)
      return item
    })
    settings.lightImages = settings.lightImages.map((item) => {
      item.src = replaceJsdelivrCDN(item.src, settings)
      return item
    })
    settings.sideThemeImages = settings.sideThemeImages.map((item) => {
      item.src = replaceJsdelivrCDN(item.src, settings)
      return item
    })
    settings.shortcutThemeImages = settings.shortcutThemeImages.map((item) => {
      item.src = replaceJsdelivrCDN(item.src, settings)
      return item
    })
    fs.writeFileSync(PATHS.settings, JSON.stringify(settings), {
      encoding: 'utf-8',
    })
  }

  const { userViewCount, loginViewCount } = getWebCount(db)
  internal.userViewCount = userViewCount < 0 ? loginViewCount : userViewCount
  internal.loginViewCount = loginViewCount

  fs.writeFileSync(PATHS.internal, JSON.stringify(internal))

  const webs = setWebs(db, settings, tags)
  await fileWriteStream(PATHS.db, webs)
  if (configJson.address) {
    await fileWriteStream(PATHS.serverdb, webs)
  }
}

main().catch(console.error)
