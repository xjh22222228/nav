// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { INavProps } from '../types'
import { websiteList } from '../store'
import { $t } from '../locale'

function getCreatedAt(node?: Element): string {
  if (!node) {
    return new Date().toISOString()
  }

  const addDate = node.getAttribute('add_date')

  if (!addDate) {
    return new Date().toISOString()
  }

  return new Date(Number(addDate) * 1000).toISOString()
}

function getTitle(node: Element) {
  return node.textContent
}

function getUrl(node: Element) {
  return node.getAttribute('href') || ''
}

function getIcon(node: Element) {
  return node.getAttribute('icon') || null
}

const nowCratedAt = getCreatedAt()

function findAllNoCate(roolDL: Element) {
  const data = []
  for (let i = 0; i < roolDL.childElementCount; i++) {
    const iItem = roolDL.childNodes[i] as any

    if (iItem && iItem.nodeName === 'DT') {
      let a = iItem.firstElementChild
      if (!a || a.nodeName !== 'A') continue

      const name = getTitle(a)
      const createdAt = getCreatedAt(a)
      const icon = getIcon(a)
      const url = getUrl(a)
      data.push({
        name,
        createdAt,
        icon,
        url,
        urls: {},
        desc: '',
        rate: 5
      })
    }
  }
  return data
}

export function parseBookmark(htmlStr: string) {
  const copyWebList = JSON.parse(JSON.stringify(websiteList))
  const data: INavProps[] = []
  const importEl = document.createElement('div')
  importEl.innerHTML = htmlStr
  const roolDL = importEl.querySelector('dl dl')

  let ii = 0
  let jj = 0
  let kk = 0
  try {
    // One Level
    for (let i = 0; i < roolDL.childElementCount; i++) {
      const iItem = roolDL.childNodes[i] as any
      if (iItem && iItem.nodeName === 'DT') {
        const titleEl = iItem.querySelector('h3') as Element
        // PERSONAL_TOOLBAR_FOLDER 收藏栏
        if (!titleEl) continue

        ii++
        const title = getTitle(titleEl)
        const createdAt = getCreatedAt(titleEl)
        data.push({
          title,
          createdAt,
          icon: null,
          nav: []
        })

        // Two Level
        jj = 0
        const DL = iItem.querySelector('dl')
        const allNoCateData = findAllNoCate(DL)
        if (allNoCateData.length > 0) {
          jj++
          data[ii - 1].nav.push({
            createdAt: nowCratedAt,
            title: $t('_uncategorized'),
            nav: [
              {
                title: $t('_uncategorized'),
                nav: allNoCateData
              }
            ]
          })
        }

        for (let j = 0; j < DL.childElementCount; j++) {
          const jItem = DL.childNodes[j]
          if (jItem && jItem.nodeName === 'DT') {
            const titleEl = jItem.querySelector('h3')
            if (!titleEl) continue
            jj++
            const title = getTitle(titleEl)
            const createdAt = getCreatedAt(titleEl)
            data[ii - 1].nav.push({
              title,
              createdAt,
              icon: null,
              nav: []
            })

            // Three Level
            kk = 0
            const DL3 = jItem.querySelector('dl')
            const allNoCateData = findAllNoCate(DL3)
            if (allNoCateData.length > 0) {
              kk++
              data[ii - 1].nav[jj - 1].nav.push({
                createdAt: nowCratedAt,
                title: $t('_uncategorized'),
                nav: allNoCateData
              })
            }
            for (let k = 0; k < DL3.childElementCount; k++) {
              const kItem = DL3.childNodes[k]
              if (kItem && kItem.nodeName === 'DT') {
                const titleEl = kItem.querySelector('h3')
                if (!titleEl) continue
                kk++
                const title = getTitle(titleEl)
                const createdAt = getCreatedAt(titleEl)
                data[ii - 1].nav[jj - 1].nav.push({
                  title,
                  createdAt,
                  nav: [],
                  icon: null
                })

                // Website Level
                const DL3 = kItem.querySelector('dl')
                for (let b = 0; b < DL3.childElementCount; b++) {
                  const wItem = DL3.childNodes[b]
                  if (wItem && wItem.nodeName === 'DT') {
                    const titleEl = wItem.querySelector('a')
                    if (!titleEl) continue
                    const title = getTitle(titleEl)
                    const createdAt = getCreatedAt(titleEl)
                    const icon = getIcon(titleEl)
                    const url = getUrl(titleEl)
                    data[ii - 1].nav[jj - 1].nav[kk - 1].nav.push({
                      name: title,
                      createdAt,
                      url,
                      desc: '',
                      urls: {},
                      rate: 5,
                      top: false,
                      icon
                    })
                  }
                }
              }
            }
          }
        }
      }
    }

    const allNoCateData = findAllNoCate(roolDL)
    if (allNoCateData.length > 0) {
      data.push({
        title: $t('_uncategorized'),
        createdAt: nowCratedAt,
        nav: [
          {
            createdAt: nowCratedAt,
            title: $t('_uncategorized'),
            nav: [
              {
                title: $t('_uncategorized'),
                nav: allNoCateData
              }
            ]
          }
        ]
      })
    }
  } catch (error) {
    console.log(error)
    return error
  }

  // 增量导入
  function r(data: any[], list: any[]) {
    for (let i = 0; i < data.length; i++) {
      const item = data[i] as any
      const title = item.title || item.name
      const idx = list.findIndex(item => (item.title || item.name) === title)

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
