// @ts-nocheck
// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.

import { Component } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { queryString, fuzzySearch, matchCurrentList } from '../../../utils'
import { INavProps, INavThreeProp } from '../../../types'
import { websiteList, settings } from '../../../store'

@Component({
  selector: 'app-home',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export default class WebpComponent {
  websiteList: INavProps[] = websiteList
  currentList: INavThreeProp[] = []
  id: number = 0
  page: number = 0
  open: boolean = false
  LOGO_CDN = settings.favicon

  constructor (private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit () {
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
      }
    })
  }

  handleCilckNav(index: number) {
    this.router.navigate(['/app'], {
      queryParams: {
        page: index,
      }
    })
    this.open = !this.open;
    (<any>window).$('.nav-open').slideUp(200)
  }

  handleToggleOpen() {
    this.open = !this.open;
    (<any>window).$('.nav-open').slideToggle(200)
  }
}
