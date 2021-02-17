// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.

import { Component } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { queryString } from '../../../utils'
import { INavProps } from '../../../types'
import { websiteList } from '../../../store'
import { LOGO_CDN } from '../../../constants'

@Component({
  selector: 'app-home',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export default class WebpComponent {
  websiteList: INavProps[] = websiteList
  id: number = 0
  page: number = 0
  open: boolean = false
  LOGO_CDN = LOGO_CDN

  constructor (private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit () {
    this.activatedRoute.queryParams.subscribe(() => {
      const { page, id } = queryString()
      this.page = page
      this.id = id
    })
  }

  handleSidebarNav (index) {
    const { page } = queryString()
    this.router.navigate(['/app'], { 
      queryParams: {
        page,
        id: index,
      }
    })
  }

  handleCilckNav (index) {
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
