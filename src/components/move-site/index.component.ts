// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component, Input, Output, EventEmitter } from '@angular/core'
import { $t } from 'src/locale'
import { setWebsiteList } from '../../utils'
import { websiteList } from '../../store'
import { INavProps, INavTwoProp, INavThreeProp, INavFourProp } from '../../types'
import { NzMessageService } from 'ng-zorro-antd/message'

@Component({
  selector: 'app-move-site',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class MoveSiteComponent {
  @Input() visible: boolean
  @Input() indexs: Array<number>
  @Output() onCancel = new EventEmitter()

  $t = $t
  websiteList: INavProps[] = websiteList
  twoOptList: INavTwoProp[] = []
  threeOptList: INavThreeProp[] = []
  checked = false
  oneSelect = ''
  twoSelect = ''
  threeSelect = ''
  moveSites: INavFourProp[] = []

  constructor (
    private message: NzMessageService
  ) {}

  ngOnInit() {}

  pushMoveSites(sites: INavFourProp[]) {
    this.moveSites = sites
  }

  hanldeOneSelect(index) {
    this.oneSelect = index
    const title = this.websiteList[index].title
    const findItem = this.websiteList.find(item => item.title === title)
    this.twoOptList = findItem.nav
    this.twoSelect = ''
    this.threeSelect = ''
  }

  hanldeTwoSelect(index) {
    this.twoSelect = index
    const title = this.twoOptList[index].title
    const findItem = this.twoOptList.find(item => item.title === title)
    this.threeOptList = findItem.nav
    this.threeSelect = ''
  }

  hanldeThreeSelect(index) {
    this.threeSelect = index
  }

  handleCancel() {
    this.onCancel.emit()
  }

  hanldeOk() {
    if (this.threeSelect === '') {
      return this.message.error($t('_sel3'))
    }

    this.moveSites.forEach((item: INavFourProp) => {
      const exists = this.websiteList[this.oneSelect]
        .nav[this.twoSelect]
        .nav[this.threeSelect]
        .nav.find((el: INavFourProp) => el.name === item.name)

      if (exists) {
        this.message.error(`${$t('_repeatAdd')} "${item.name}"`)
      } else {
        this.websiteList[this.oneSelect]
        .nav[this.twoSelect]
        .nav[this.threeSelect]
        .nav
        .unshift(item)

        if (!this.checked) {
          const [a, b, c, d] = this.indexs
          this.websiteList[a]
          .nav[b]
          .nav[c]
          .nav.splice(d, 1)
        }

        this.message.success(`"${item.name}" ${$t('_moveSuccess')}`)
      }
    });
    setWebsiteList(this.websiteList)
    this.handleCancel()
  }
}
