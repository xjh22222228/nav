// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.

import { Component } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { queryString, setLocation } from '../utils'

@Component({
  selector: 'app-xiejiahe',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor (private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.goRoute()
    this.activatedRoute.queryParams.subscribe(setLocation)
  }

  goRoute() {
    const { page, id, q } = queryString()
    const screenWidth = window.innerWidth
    const queryParams = { page, id, q }

    if (screenWidth < 768) {
      this.router.navigate(['/app'], { queryParams })
    }
  }
}
