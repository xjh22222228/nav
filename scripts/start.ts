// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present x.iejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import fs from 'fs'
import path from 'path'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
import defaultDb from './db'
import yaml from 'js-yaml'
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
  replaceJsdelivrCDN,
  PATHS,
} from './utils'
import type {
  ITagPropValues,
  ISettings,
  INavProps,
  InternalProps,
} from '../src/types/index'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Shanghai')

const initConfig = () => {
  const pkgJson = JSON.parse(fs.readFileSync(PATHS.pkg).toString())
  const config = yaml.load(fs.readFileSync(PATHS.config).toString()) as Record<
    string,
    any
  >

  return {
    version: pkgJson.version,
    gitRepoUrl: config['gitRepoUrl'],
    imageRepoUrl: config['imageRepoUrl'],
    branch: config['branch'],
    hashMode: config['hashMode'],
    address: config['address'],
    email: config['email'],
    port: config['port'],
    datetime: dayjs.tz().format('YYYY-MM-DD HH:mm'),
  } as const
}

const readDb = (): INavProps[] => {
  try {
    const strings = fs.readFileSync(PATHS.db).toString().trim()
    if (!strings) throw new Error('empty')

    return strings[0] === '['
      ? JSON.parse(strings)
      : JSON.parse(LZString.decompressFromBase64(strings)) ||
          JSON.parse(LZString.decompressFromBase64(defaultDb))
  } catch (e) {
    return JSON.parse(LZString.decompressFromBase64(defaultDb))
  }
}

const main = async () => {
  const configJson = initConfig()
  fs.writeFileSync(
    path.join('.', 'nav.config.json'),
    JSON.stringify(configJson)
  )

  const db = readDb()
  let internal = {} as InternalProps
  let settings = {} as ISettings
  let tags: ITagPropValues[] = []
  let search: any[] = []
  let components: Record<string, any>[] = []

  try {
    internal = JSON.parse(fs.readFileSync(PATHS.internal).toString())
    settings = JSON.parse(fs.readFileSync(PATHS.settings).toString())
    tags = JSON.parse(fs.readFileSync(PATHS.tag).toString())
    search = JSON.parse(fs.readFileSync(PATHS.search).toString())
  } catch {}

  try {
    components = JSON.parse(fs.readFileSync(PATHS.component).toString())
  } catch {
  } finally {
    let idx = components.findIndex((item) => item['type'] === 1)
    const calendar: Record<string, any> = {
      type: 1,
      id: -1,
      topColor: '#ff5a5d',
      bgColor: '#1d1d1d',
    }
    if (idx >= 0) {
      components[idx] = {
        ...calendar,
        ...components[idx],
      }
    } else {
      components.push(calendar)
    }
    //
    idx = components.findIndex((item) => item['type'] === 2)
    const offWork: Record<string, any> = {
      type: 2,
      id: -2,
      workTitle: '距离下班还有',
      restTitle: '休息啦',
      startDate: new Date(2018, 3, 26, 9, 0, 0).getTime(),
      date: new Date(2018, 3, 26, 18, 0, 0).getTime(),
    }
    if (idx >= 0) {
      components[idx] = {
        ...offWork,
        ...components[idx],
      }
    } else {
      components.push(offWork)
    }
    //
    idx = components.findIndex((item) => item['type'] === 4)
    const image: Record<string, any> = {
      type: 4,
      id: -4,
      url: 'https://gcore.jsdelivr.net/gh/xjh22222228/public@gh-pages/nav/component1.jpg',
      go: '',
      text: '只有认可，才能强大',
    }
    if (idx >= 0) {
      components[idx] = {
        ...image,
        ...components[idx],
      }
      components[idx]['url'] = replaceJsdelivrCDN(
        components[idx]['url'],
        settings
      )
    } else {
      components.push(image)
    }
    //
    idx = components.findIndex((item) => item['type'] === 5)
    const countdown: Record<string, any> = {
      type: 5,
      id: -5,
      topColor: 'linear-gradient(90deg, #FAD961 0%, #F76B1C 100%)',
      bgColor: 'rgb(235,129,124)',
      url: 'https://gcore.jsdelivr.net/gh/xjh22222228/public@gh-pages/nav/component2.jpg',
      title: '距离春节还有',
      dateColor: '#fff',
      dayColor: '#fff',
      date: '2026-02-17',
    }
    if (idx >= 0) {
      components[idx] = {
        ...countdown,
        ...components[idx],
      }
      components[idx]['url'] = replaceJsdelivrCDN(
        components[idx]['url'],
        settings
      )
    } else {
      components.push(countdown)
    }
    //
    idx = components.findIndex((item) => item['type'] === 3)
    const runtime: Record<string, any> = {
      type: 3,
      id: -3,
      title: '已稳定运行',
    }
    if (idx >= 0) {
      components[idx] = {
        ...runtime,
        ...components[idx],
      }
    } else {
      components.push(runtime)
    }
    //
    idx = components.findIndex((item) => item['type'] === 6)
    const html: Record<string, any> = {
      type: 6,
      id: -6,
      html: '你好，发现导航',
      width: 160,
      bgColor: '#fff',
    }
    if (idx >= 0) {
      components[idx] = {
        ...html,
        ...components[idx],
      }
    } else {
      components.push(html)
    }
    idx = components.findIndex((item) => item['type'] === 7)
    const holiday: Record<string, any> = {
      type: 7,
      id: -7,
      items: [],
    }
    if (idx >= 0) {
      components[idx] = {
        ...holiday,
        ...components[idx],
      }
    } else {
      components.push(holiday)
    }
    fs.writeFileSync(PATHS.component, JSON.stringify(components))
  }

  {
    if (!search.length) {
      search = [
        {
          name: '站内',
          icon: 'https://gcore.jsdelivr.net/gh/xjh22222228/public@gh-pages/nav/logo.svg',
          placeholder: '站内搜索',
          blocked: false,
          isInner: true,
        },
        {
          name: '百度',
          url: 'https://www.baidu.com/s?wd=',
          icon: 'https://gcore.jsdelivr.net/gh/xjh22222228/nav-image@image/baidu.svg',
          placeholder: '百度一下',
          blocked: false,
          isInner: false,
        },
        {
          name: 'Google',
          url: 'https://www.google.com/search?q=',
          icon: 'https://gcore.jsdelivr.net/gh/xjh22222228/nav-image@image/google.svg',
          blocked: false,
          isInner: false,
        },
        {
          name: '必应',
          url: 'https://cn.bing.com/search?q=',
          icon: 'https://gcore.jsdelivr.net/gh/xjh22222228/nav-image@image/bing.svg',
          blocked: false,
          isInner: false,
        },
        {
          name: 'GitHub',
          url: 'https://github.com/search?q=',
          icon: 'https://gcore.jsdelivr.net/gh/xjh22222228/nav-image@image/github.svg',
          placeholder: 'Search GitHub',
          blocked: false,
          isInner: false,
        },
        {
          name: '知乎',
          url: 'https://www.zhihu.com/search?type=content&q=',
          icon: 'https://gcore.jsdelivr.net/gh/xjh22222228/nav-image@image/zhihu.svg',
          blocked: false,
          isInner: false,
        },
        {
          name: '豆瓣',
          url: 'https://search.douban.com/book/subject_search?search_text=',
          icon: 'https://gcore.jsdelivr.net/gh/xjh22222228/nav-image@image/douban.svg',
          placeholder: '书名、作者、ISBN',
          blocked: false,
          isInner: false,
        },
      ]
      fs.writeFileSync(PATHS.search, JSON.stringify(search), {
        encoding: 'utf-8',
      })
    }
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
    settings.appTheme ??= 'App'
    settings.openSEO ??= !configJson.address
    settings.headerContent ??= ''
    settings.footerContent ??= `
<div class="dark-white">
  <div>共收录$\{total\}个网站</div>
  <div>Copyright © 2018-$\{year} $\{hostname}, All Rights Reserved</div>  
</div>
`.trim()
    settings.showThemeToggle ??= true

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
    settings.spiderQty ??= 200
    settings.spiderTimeout ??= 6
    settings.spiderTimeout = Number(settings.spiderTimeout) || 6
    settings.loadingCode ??= ''

    settings.appCardStyle ??= 'retro'
    settings.appDocTitle ||= ''
    settings.gitHubCDN ||= 'gcore.jsdelivr.net'
    settings.components ||= []

    // 替换CDN
    search = search.map((item) => {
      item.icon = replaceJsdelivrCDN(item.icon, settings)
      return item
    })
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
  fs.writeFileSync(PATHS.db, JSON.stringify(setWebs(db, settings, tags)))
}

main().catch(console.error)
