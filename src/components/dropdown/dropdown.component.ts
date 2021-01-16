import { Component, OnInit, Input } from '@angular/core'
import { NzMessageService } from 'ng-zorro-antd/message'
import { getToken } from '../../utils/user'
import { setWebsiteList, queryString } from '../../utils'
import { websiteList, isEditing } from '../../store'
import { Router } from '@angular/router'
import { setAnnotate } from '../../utils/ripple'

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {
  @Input() delIconStyle: string
  @Input() oIdx: number
  @Input() twoIdx: number
  @Input() threeIdx: number
  @Input() fourIdx: number

  websiteList = websiteList
  isLogin: boolean = !!getToken()
  isEditing = isEditing

  constructor(private message: NzMessageService, private router: Router) {}

  ngOnInit(): void {
  }

  confirmDel() {
    const { page, id } = queryString()

    // 删除网站
    if (
      this.oIdx >= 0 &&
      this.twoIdx >= 0 &&
      this.threeIdx >= 0 &&
      this.fourIdx >= 0
    ) {
      this.websiteList[this.oIdx].nav[this.twoIdx].nav[this.threeIdx].nav.splice(this.fourIdx, 1)
    } else if (
      this.oIdx >= 0 &&
      this.twoIdx >= 0 &&
      this.threeIdx >= 0
    ) {
      // 删除三级分类
      this.websiteList[this.oIdx].nav[this.twoIdx].nav.splice(this.threeIdx, 1)
    } else if (
      this.oIdx >= 0 &&
      this.twoIdx >= 0
    ) {
      // 删除二级分类
      if (this.websiteList[this.oIdx]?.nav?.length <= 1) {
        return this.message.error('至少保留一项, 请先添加再删除!')
      }

      this.router.navigate([this.router.url.split('?')[0]], {
        queryParams: {
          page,
          id: id > 0 ? id - 1 : 0,
        }
      })

      delete this.websiteList[this.oIdx].id
      this.websiteList[this.oIdx].nav.splice(this.twoIdx, 1)
    } else if (this.oIdx >= 0) {
      // 删除一级分类
      if (this.websiteList.length === 1) {
        this.message.error('至少保留一项, 请先添加再删除!')
        return
      }

      this.router.navigate([this.router.url.split('?')[0]], {
        queryParams: {
          page: page > 0 ? page - 1 : 0,
          id: 0
        }
      })
      
      this.websiteList.splice(this.oIdx, 1)
      setTimeout(() => {
        setAnnotate()
      }, 100)
    }

    setWebsiteList(this.websiteList)
  }
}
