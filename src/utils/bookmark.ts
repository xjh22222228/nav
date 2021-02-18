// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { INavProps } from '../types'
import { websiteList } from '../store'

export function parseBookmark(htmlStr: string) {
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

  const mergeList = [...data, ...websiteList]
  const newList = [];

  for (let i = 0; i < mergeList.length; i++) {
    const item = mergeList[i]
    const exists = newList.some(el => el.title === item.title)
    if (!exists) {
      newList.push(item)
    }
  }

  return newList
}
