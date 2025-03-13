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
import { deleteWebByIds, deleteClassByIds } from 'src/utils/web'
import { getClassById } from 'src/utils'
import { getTempId, isSelfDevelop } from 'src/utils/utils'
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
  twoOptions: INavTwoProp[] = []
  threeOptions: INavThreeProp[] = []
  isCopy = false
  isSame = false
  oneSelect: number = -1
  twoSelect: number = -1
  threeSelect: number = -1
  moveItems: any[] = []
  showModal = false
  level = 4
  id = -1

  constructor(private message: NzMessageService) {
    event.on('MOVE_WEB', (props: any) => {
      this.open(this, props)
    })
  }

  ngOnInit() {}

  open(
    ctx: this,
    props: {
      id?: number
      level?: number
      data: IWebProps[]
    }
  ) {
    ctx.oneSelect = -1
    ctx.twoSelect = -1
    ctx.threeSelect = -1
    ctx.twoOptions = []
    ctx.threeOptions = []
    ctx.moveItems = props.data
    ctx.level = props.level ?? 4
    ctx.showModal = true
    ctx.id = props.id ?? -1
  }

  hanldeOneSelect(id: number) {
    this.oneSelect = id
    const data = this.websiteList.find((item) => item.id === id)
    this.twoOptions = data?.nav || []
    this.twoSelect = -1
    this.threeSelect = -1
  }

  hanldeTwoSelect(id: number) {
    this.twoSelect = id
    const data = this.twoOptions.find((item) => item.id === id)
    this.threeOptions = data?.nav || []
    this.threeSelect = -1
  }

  hanldeThreeSelect(id: number) {
    this.threeSelect = id
  }

  handleCancel() {
    this.isCopy = false
    this.isSame = false
    this.showModal = false
  }

  async hanldeOk(): Promise<any> {
    let tempId = getTempId()
    try {
      const moveItems: INavTwoProp[] & IWebProps[] & INavThreeProp[] =
        JSON.parse(JSON.stringify(this.moveItems))
      if (this.level === 2) {
        if (this.oneSelect == -1) {
          return this.message.error($t('_sel1'))
        }
        const { oneIndex } = getClassById(this.oneSelect)
        for (const item of moveItems) {
          const id = item.id
          const has = this.websiteList[oneIndex].nav.some(
            (item) => item.id === id
          )
          if (has) {
            this.message.error($t('_sameExists'))
            return
          }
          if (this.isCopy) {
            tempId -= 1
            if (this.isSame) {
              item.rId = tempId
            } else {
              item.id = tempId
              delete item.rId
            }
          } else {
            await deleteClassByIds([item.rId || id], !!item.rId)
          }
          this.websiteList[oneIndex].nav.unshift(item)
          this.message.success(`"${item.title}" ${$t('_moveSuccess')}`)
        }
      } else if (this.level === 3) {
        if (this.twoSelect == -1) {
          return this.message.error($t('_sel2'))
        }
        const { oneIndex, twoIndex } = getClassById(this.twoSelect)
        for (const item of moveItems) {
          const id = item.id
          const has = this.websiteList[oneIndex].nav[twoIndex].nav.some(
            (item) => item.id === id
          )
          if (has) {
            this.message.error($t('_sameExists'))
            return
          }
          if (this.isCopy) {
            tempId -= 1
            if (this.isSame) {
              item.rId = tempId
            } else {
              item.id = tempId
              delete item.rId
            }
          } else {
            await deleteClassByIds([item.rId || id], !!item.rId)
          }
          this.websiteList[oneIndex].nav[twoIndex].nav.unshift(item)
          this.message.success(`"${item.title}" ${$t('_moveSuccess')}`)
        }
      } else if (this.level === 4) {
        if (this.threeSelect == -1) {
          return this.message.error($t('_sel3'))
        }
        const { oneIndex, twoIndex, threeIndex } = getClassById(
          this.threeSelect
        )
        for (const item of moveItems) {
          const id = item.id
          const has = this.websiteList[oneIndex].nav[twoIndex].nav[
            threeIndex
          ].nav.some((item) => item.id === id)
          if (has) {
            this.message.error($t('_sameExists'))
            return
          }

          if (this.isCopy) {
            tempId -= 1
            if (this.isSame) {
              item.rId = tempId
            } else {
              item.id = tempId
              delete item.rId
            }
          } else {
            await deleteWebByIds([item.rId || id], !!item.rId)
          }
          this.websiteList[oneIndex].nav[twoIndex].nav[threeIndex].nav.unshift(
            item
          )
          this.message.success(`"${item.name}" ${$t('_moveSuccess')}`)
        }
      }

      setWebsiteList(this.websiteList)
      this.handleCancel()
      if (!isSelfDevelop) {
        event.emit('WEB_REFRESH')
      }
    } catch (error: any) {
      this.message.error(error.message)
    }
  }
}
