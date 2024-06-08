// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.

import { Component } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { queryString, fuzzySearch, matchCurrentList } from 'src/utils'
import { INavProps, INavThreeProp } from 'src/types'
import { websiteList, settings, tagMap } from 'src/store'

@Component({
  selector: 'app-home',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export default class WebpComponent {
  objectKeys = Object.keys
  websiteList: INavProps[] = websiteList
  currentList: INavThreeProp[] = []
  id: number = 0
  page: number = 0
  open: boolean = false
  LOGO_CDN = settings.favicon
  tagMap = tagMap

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(() => {
      const { page, id, q } = queryString()
      this.page = page
      this.id = id
      if (q) {
        this.currentList = fuzzySearch(this.websiteList, q)
      } else {
        this.currentList = matchCurrentList()
      }
    })
  }

  handleSidebarNav(index: number) {
    const { page } = queryString()
    this.router.navigate(['/app'], {
      queryParams: {
        page,
        id: index,
      },
    })
  }

  handleCilckNav(index: number) {
    this.router.navigate(['/app'], {
      queryParams: {
        page: index,
      },
    })
    this.open = !this.open
  }

  handleToggleOpen() {
    this.open = !this.open
  }

  trackByItem(a: any, item: any) {
    return item.title
  }

  trackByItemWeb(a: any, item: any) {
    return item.id
  }
}
