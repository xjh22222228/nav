// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { INavProps } from '../../types'
import { websiteList } from '../../store'
import { getToken } from '../../utils/user'
import { buildTree } from '../../utils/tree'

@Component({
  selector: 'app-admin',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export default class WebpComponent {

  constructor (private router: Router, private activatedRoute: ActivatedRoute) {}
  websiteList: INavProps[] = websiteList
  isLogin = !!getToken()

  ngOnInit () {
    console.log(buildTree())
  }
}
