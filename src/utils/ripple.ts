import { annotate } from 'rough-notation'
import { queryString } from './index'

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

  const annotation = annotate(elList[page], {
    type: 'underline',
    color: '#f9826c',
    padding: 3,
    strokeWidth: 3
  })
  ANNOTATE_EQUEUE.push(annotation)
  annotation.show()
}
