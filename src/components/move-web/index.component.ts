// Copyright @ 2018-present xiejiahe. All rights reserved. MIT license.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { $t } from 'src/locale'
import { setWebsiteList } from '../../utils'
import { websiteList } from '../../store'
import { INavProps, INavTwoProp, INavThreeProp, IWebProps } from '../../types'
import { NzMessageService } from 'ng-zorro-antd/message'
import event from 'src/utils/mitt'

@Component({
  selector: 'app-move-web',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class MoveWebComponent {
  $t = $t
  websiteList: INavProps[] = websiteList
  twoOptList: INavTwoProp[] = []
  threeOptList: INavThreeProp[] = []
  checked = false
  oneSelect: number | undefined
  twoSelect: number | undefined
  threeSelect: number | undefined
  moveSites: IWebProps[] = []
  showModal = false
  indexs: Array<number> = []

  constructor(private message: NzMessageService) {
    event.on('MOVE_WEB', (props: any) => {
      this.open(this, props)
    })
  }

  ngOnInit() {}

  open(
    ctx: any,
    props: {
      indexs: number[]
      data: IWebProps[]
    }
  ) {
    ctx.indexs = props.indexs
    ctx.moveSites = props.data
    ctx.showModal = true
  }

  pushMoveSites(sites: IWebProps[]) {
    this.moveSites = sites
  }

  hanldeOneSelect(index: number) {
    this.oneSelect = index
    const title = this.websiteList[index].title
    const findItem = this.websiteList.find((item) => item.title === title)
    this.twoOptList = findItem!.nav
    this.twoSelect = undefined
    this.threeSelect = undefined
  }

  hanldeTwoSelect(index: number) {
    this.twoSelect = index
    const title = this.twoOptList[index].title
    const findItem = this.twoOptList.find((item) => item.title === title)
    this.threeOptList = findItem!.nav
    this.threeSelect = undefined
  }

  hanldeThreeSelect(index: number) {
    this.threeSelect = index
  }

  handleCancel() {
    this.showModal = false
  }

  hanldeOk() {
    if (this.threeSelect == null) {
      return this.message.error($t('_sel3'))
    }
    const indexs = this.indexs.filter((i) => i != null)
    if (indexs.length !== 4) {
      return this.message.error(`move web: indexs数量不正确${indexs.join(',')}`)
    }

    try {
      const oneSelect = this.oneSelect as number
      const twoSelect = this.twoSelect as number
      const threeSelect = this.threeSelect as number
      this.moveSites.forEach((item: IWebProps) => {
        const exists = this.websiteList[oneSelect].nav[twoSelect].nav[
          threeSelect
        ].nav.find((el: IWebProps) => el.name === item.name)

        if (exists) {
          this.message.error(`${$t('_repeatAdd')} "${item.name}"`)
        } else {
          this.websiteList[oneSelect].nav[twoSelect].nav[
            threeSelect
          ].nav.unshift(item)

          if (!this.checked) {
            const [a, b, c, d] = indexs
            this.websiteList[a].nav[b].nav[c].nav.splice(d, 1)
          }

          this.message.success(`"${item.name}" ${$t('_moveSuccess')}`)
        }
      })
      setWebsiteList(this.websiteList)
      this.handleCancel()
    } catch (error: any) {
      this.message.error(error.message)
    }
  }
}
