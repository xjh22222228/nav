// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { $t } from 'src/locale'
import { setWebsiteList } from 'src/utils/web'
import { websiteList } from '../../store'
import { INavProps, INavTwoProp, INavThreeProp, IWebProps } from '../../types'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzModalModule } from 'ng-zorro-antd/modal'
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox'
import { NzSelectModule } from 'ng-zorro-antd/select'
import event from 'src/utils/mitt'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzCheckboxModule,
    NzModalModule,
    NzSelectModule,
  ],
  selector: 'app-move-web',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class MoveWebComponent {
  $t = $t
  websiteList: INavProps[] = websiteList
  twoOptList: INavTwoProp[] = []
  threeOptList: INavThreeProp[] = []
  isCopy = false
  oneSelect: number | undefined = undefined
  twoSelect: number | undefined = undefined
  threeSelect: number | undefined = undefined
  moveSites: any[] = []
  showModal = false
  indexs: Array<number> = []
  level = 4

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
      level: number
    }
  ) {
    ctx.oneSelect = undefined
    ctx.twoSelect = undefined
    ctx.threeSelect = undefined
    ctx.twoOptList = []
    ctx.threeOptList = []
    ctx.indexs = props.indexs
    ctx.moveSites = props.data
    ctx.level = props.level ?? 4
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

  hanldeOk(): any {
    const indexs = this.indexs
    const oneSelect = this.oneSelect as number
    const twoSelect = this.twoSelect as number
    const threeSelect = this.threeSelect as number

    try {
      const moveSites = JSON.parse(JSON.stringify(this.moveSites))
      if (this.level === 2) {
        if (this.oneSelect == null) {
          return this.message.error($t('_sel1'))
        }
        moveSites.forEach((item: any) => {
          const exists = this.websiteList[oneSelect].nav.find(
            (el: any) => el.title === item.title
          )

          if (exists) {
            this.message.error(`${$t('_repeatAdd')} "${item.title}"`)
          } else {
            this.websiteList[oneSelect].nav.unshift(item)

            if (!this.isCopy) {
              const [a, b, c, d] = indexs
              this.websiteList[a].nav.splice(d, 1)
            }

            this.message.success(`"${item.title}" ${$t('_moveSuccess')}`)
          }
        })
      } else if (this.level === 3) {
        if (this.twoSelect == null) {
          return this.message.error($t('_sel2'))
        }
        moveSites.forEach((item: any) => {
          const exists = this.websiteList[oneSelect].nav[twoSelect].nav.find(
            (el: any) => el.title === item.title
          )

          if (exists) {
            this.message.error(`${$t('_repeatAdd')} "${item.title}"`)
          } else {
            this.websiteList[oneSelect].nav[twoSelect].nav.unshift(item)

            if (!this.isCopy) {
              const [a, b, c, d] = indexs
              this.websiteList[a].nav[b].nav.splice(d, 1)
            }

            this.message.success(`"${item.title}" ${$t('_moveSuccess')}`)
          }
        })
      } else if (this.level === 4) {
        if (this.threeSelect == null) {
          return this.message.error($t('_sel3'))
        }
        if (indexs.length !== 4) {
          return this.message.error(
            `move web: indexs数量不正确${indexs.join(',')}`
          )
        }
        moveSites.forEach((item: any) => {
          item.id = item.id + `${Math.random()}`
          this.websiteList[oneSelect].nav[twoSelect].nav[
            threeSelect
          ].nav.unshift(item)

          if (!this.isCopy) {
            const [a, b, c, d] = indexs
            this.websiteList[a].nav[b].nav[c].nav.splice(d, 1)
          }

          this.message.success(`"${item.name}" ${$t('_moveSuccess')}`)
        })
      }

      setWebsiteList(this.websiteList)
      this.handleCancel()
    } catch (error: any) {
      this.message.error(error.message)
    }
  }
}
