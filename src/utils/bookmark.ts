// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xie.jiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { INavProps, IWebProps, INavTwoProp, INavThreeProp } from '../types'
import { websiteList } from '../store'
import { $t } from '../locale'
import { getTempId } from './utils'

let id = getTempId()

const getTitle = (node: Element): string => node.textContent || ''
const getUrl = (node: Element): string => node.getAttribute('href') || ''
const getIcon = (node: Element): string => node.getAttribute('icon') || ''

function findUnclassifiedData(roolDL: Element): IWebProps[] {
  const data: IWebProps[] = []
  Array.from(roolDL.children).forEach((iItem) => {
    if (iItem.nodeName === 'DT') {
      const a = iItem.firstElementChild
      if (a?.nodeName === 'A') {
        data.push({
          name: getTitle(a),
          icon: getIcon(a),
          url: getUrl(a),
          tags: [],
          desc: '',
          rate: 5,
          id: (id += 1),
          breadcrumb: [],
        })
      }
    }
  })
  return data
}

interface BookmarkParseResult {
  message?: string
  data?: INavProps[]
}

export function parseBookmark(
  htmlStr: string
): BookmarkParseResult | INavProps[] {
  const copyWebList = JSON.parse(JSON.stringify(websiteList))
  const data: INavProps[] = []
  const importEl = document.createElement('div')
  importEl.innerHTML = htmlStr
  const roolDL = importEl.querySelector('dl dl')

  if (!roolDL) {
    return {
      message: '未找到dl dl节点',
    }
  }

  try {
    function processWebsiteLevel(DL3: Element, parentData: INavThreeProp) {
      Array.from(DL3.children).forEach((wItem) => {
        if (wItem.nodeName === 'DT') {
          const titleEl = wItem.querySelector('a')
          if (titleEl) {
            parentData.nav.push({
              name: getTitle(titleEl),
              url: getUrl(titleEl),
              desc: '',
              tags: [],
              rate: 5,
              top: false,
              icon: getIcon(titleEl),
              id: (id += 1),
              breadcrumb: [],
            })
          }
        }
      })
    }

    function processThreeLevel(DL3: Element, parentNav: INavTwoProp) {
      Array.from(DL3.children).forEach((kItem) => {
        if (kItem.nodeName === 'DT') {
          const titleEl = kItem.querySelector('h3')
          if (titleEl) {
            const title = getTitle(titleEl)
            const threeLevel: INavThreeProp = {
              id: (id += 1),
              title,
              nav: [],
              icon: '',
            }
            parentNav.nav.push(threeLevel)

            const websiteDL = kItem.querySelector('dl')
            if (websiteDL) {
              processWebsiteLevel(websiteDL, threeLevel)
            }
          }
        }
      })
    }

    function processTwoLevel(DL: Element, parentData: INavProps) {
      Array.from(DL.children).forEach((jItem) => {
        if (jItem.nodeName === 'DT') {
          const titleEl = jItem.querySelector('h3')
          if (titleEl) {
            const title = getTitle(titleEl)
            const twoLevel: INavTwoProp = {
              id: (id += 1),
              title,
              icon: '',
              nav: [],
            }
            parentData.nav.push(twoLevel)

            const DL3 = jItem.querySelector('dl')
            if (DL3) {
              const unclassifiedData = findUnclassifiedData(DL3)
              if (unclassifiedData.length > 0) {
                twoLevel.nav.push({
                  id: (id += 1),
                  title,
                  icon: '',
                  nav: unclassifiedData,
                })
              }
              processThreeLevel(DL3, twoLevel)
            }
          }
        }
      })
    }

    // Process One Level
    Array.from(roolDL.children).forEach((iItem) => {
      if (iItem.nodeName === 'DT') {
        const titleEl = iItem.querySelector('h3')
        if (titleEl) {
          const title = getTitle(titleEl)
          const oneLevel: INavProps = {
            id: (id += 1),
            title,
            icon: '',
            nav: [],
          }
          data.push(oneLevel)

          const DL = iItem.querySelector('dl')
          if (DL) {
            const unclassifiedData = findUnclassifiedData(DL)
            if (unclassifiedData.length > 0) {
              oneLevel.nav.push({
                id: (id += 1),
                title,
                icon: '',
                nav: [
                  {
                    id: (id += 1),
                    title,
                    icon: '',
                    nav: unclassifiedData,
                  },
                ],
              })
            }
            processTwoLevel(DL, oneLevel)
          }
        }
      }
    })

    const unclassifiedData = findUnclassifiedData(roolDL)
    if (unclassifiedData.length > 0) {
      data.push({
        id: (id += 1),
        title: $t('_uncategorized'),
        icon: '',
        nav: [
          {
            id: (id += 1),
            title: $t('_uncategorized'),
            icon: '',
            nav: [
              {
                id: (id += 1),
                title: $t('_uncategorized'),
                icon: '',
                nav: unclassifiedData,
              },
            ],
          },
        ],
      })
    }
  } catch (error) {
    console.log(error)
    throw error
  }

  // 增量导入
  function r(data: any[], list: any[]) {
    for (let i = 0; i < data.length; i++) {
      const item = data[i] as any
      const title = item.title || item.url
      const idx = list.findIndex((item) => (item.title || item.url) === title)

      // Repeat
      if (idx !== -1) {
        if (Array.isArray(item.nav)) {
          r(item.nav, list[idx].nav)
        }
      } else {
        list.push(item)
      }
    }
  }
  r(data, copyWebList)

  return copyWebList
}
