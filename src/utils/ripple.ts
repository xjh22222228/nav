// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.

import { annotate } from 'rough-notation'
import { queryString } from './index'
import { websiteList } from '../store'

let ANNOTATE_EQUEUE = []

export function initRipple() {
  (<any>window).$.ripple('.ripple-btn', {
    multi: true,
    debug: false,
    opacity: .2,
  })
}

export function setAnnotate(querySelector = '.top-nav .ripple-btn') {
  const elList = document.querySelectorAll(querySelector) || []
  if (elList.length === 0) return

  ANNOTATE_EQUEUE.forEach(item => item.hide())
  ANNOTATE_EQUEUE = []
  const { page } = queryString()

  if (page >= websiteList.length || page < 0) return

  const annotation = annotate(elList[page], {
    type: 'underline',
    color: '#f9826c',
    padding: 3,
    strokeWidth: 3
  })
  ANNOTATE_EQUEUE.push(annotation)
  annotation.show()
}
