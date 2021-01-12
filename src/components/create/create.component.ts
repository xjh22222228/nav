import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { getWebsiteList } from '../../utils'
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  @Input() visible: boolean
  @Output() onCancel = new EventEmitter()

  websiteList = getWebsiteList()
  twoList = []
  title = '新增'
  token = ''
  isLogin = false
  radioType = '1'
  name = ''
  oneSelectValue = ''
  twoSelectValue = ''

  constructor(private message: NzMessageService) {}

  ngOnInit(): void {
    const token = window.localStorage.getItem('token')
    if (token) {
      this.token = token
      this.isLogin = true
    } else {
      this.title = '请登录'
    }
  }

  hanldeOneSelect() {
    const findItem = this.websiteList.find(item => item.title === this.oneSelectValue);
    this.twoList = findItem.nav
    this.twoSelectValue = ''
  }

  hanldeCancel() {
    this.onCancel.emit()
  }

  handleOk() {
    this.message.error('请选择后提交！');
  }
}
