// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { INavProps } from '../types'
import { websiteList } from '../store'

export function parseBookmark(htmlStr: string) {
  const copyWebList = JSON.parse(JSON.stringify(websiteList))
  const data: INavProps[] = []
  const importEl = document.createElement('div')
  importEl.innerHTML = htmlStr
  const roolDL = importEl.querySelector('dl dl')

  // 未分类
  let hasNoCate = false
  const cateCreateAt = new Date().toISOString()
  const noCate: INavProps = {
    title: '未分类',
    createdAt: cateCreateAt,
    nav: [
      {
        createdAt: cateCreateAt,
        title: '未分类',
        nav: [
          {
            title: '未分类',
            nav: []
          }
        ]
      }
    ]
  }

  function findA(node: Element) {
    let a = node.firstElementChild
    if (!a && a.nodeName === 'a') return

    hasNoCate = true
    const name = a.textContent
    const createdAt = new Date(Number(a.getAttribute('add_date')) * 1000).toISOString()
    const icon = a.getAttribute('icon') || null
    const url = a.getAttribute('href') || ''
    noCate.nav[0].nav[0].nav.push({
      name,
      createdAt,
      icon,
      url,
      urls: {},
      desc: '',
      rate: 5
    })
  }

  let ii = 0
  let jj = 0
  let kk = 0
  try {
    // One Level
    for (let i = 0; i < roolDL.childElementCount; i++) {
      const iItem = roolDL.childNodes[i] as any
      if (iItem && iItem.nodeName === 'DT') {
        findA(iItem)
        const titleEl = iItem.querySelector('h3')
        if (!titleEl) continue
        ii++
        const title = titleEl.textContent
        const createdAt = new Date(titleEl.getAttribute('add_date') * 1000).toISOString()
        data.push({
          title,
          createdAt,
          icon: null,
          nav: []
        })

        // Two Level
        jj = 0
        const DL = iItem.querySelector('dl')
        for (let j = 0; j < DL.childElementCount; j++) {
          const jItem = DL.childNodes[j]
          if (jItem && jItem.nodeName === 'DT') {
            findA(jItem)
            const titleEl = jItem.querySelector('h3')
            if (!titleEl) continue
            jj++
            const title = titleEl.textContent
            const createdAt = new Date(titleEl.getAttribute('add_date') * 1000).toISOString()
            data[ii - 1].nav.push({
              title,
              createdAt,
              icon: null,
              nav: []
            })

            // Three Level
            kk = 0
            const DL3 = jItem.querySelector('dl')
            for (let k = 0; k < DL3.childElementCount; k++) {
              const kItem = DL3.childNodes[k]
              if (kItem && kItem.nodeName === 'DT') {
                findA(kItem)
                const titleEl = kItem.querySelector('h3')
                if (!titleEl) continue
                kk++
                const title = titleEl.textContent
                const createdAt = new Date(titleEl.getAttribute('add_date') * 1000).toISOString()
                data[ii - 1].nav[jj - 1].nav.push({
                  title,
                  createdAt,
                  nav: [],
                  icon: null
                })

                // Website Level
                const DL3 = kItem.querySelector('dl')
                for (let b = 0; b < DL3.childElementCount; b++) {
                  const kItem = DL3.childNodes[b]
                  if (kItem && kItem.nodeName === 'DT') {
                    const titleEl = kItem.querySelector('a')
                    if (!titleEl) continue
                    const title = titleEl.textContent
                    const createdAt = new Date(titleEl.getAttribute('add_date') * 1000).toISOString()
                    const icon = titleEl.getAttribute('icon') || null
                    const url = titleEl.getAttribute('href')
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
  } catch (error) {
    return error
  }

  if (hasNoCate) {
    data.push(noCate)
  }

  // 增量导入
  function r(data: any[], list: any[]) {
    for (let i = 0; i < data.length; i++) {
      const item = data[i] as any
      const title = item.title || item?.name
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

  console.log(copyWebList)

  return copyWebList
}
