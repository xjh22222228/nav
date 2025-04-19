// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'
import {
  verifyToken,
  createBranch,
  authorName,
  isStandaloneImage,
} from 'src/api'
import {
  setToken,
  removeToken,
  removeWebsite,
  setImageToken,
} from 'src/utils/user'
import { $t } from 'src/locale'
import { isSelfDevelop } from 'src/utils/utils'
import { NzModalModule } from 'ng-zorro-antd/modal'
import { NzInputModule } from 'ng-zorro-antd/input'
import config from '../../../nav.config.json'

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, NzModalModule, NzInputModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  @Input() visible = false
  @Output() onCancel = new EventEmitter<void>()
  @ViewChild('input', { static: false }) input!: ElementRef

  readonly $t = $t
  readonly isSelfDevelop = isSelfDevelop
  token = ''
  imageToken = ''
  submitting = false
  showImgToken = false

  constructor(private readonly message: NzMessageService) {
    this.showImgToken = isStandaloneImage()
  }

  ngAfterViewInit(): void {
    this.inputFocus()
  }

  handleCancel(): void {
    this.onCancel.emit()
  }

  private inputFocus(): void {
    setTimeout(() => {
      this.input?.nativeElement?.focus()
    }, 300)
  }

  onKey(event: KeyboardEvent): void {
    if (event.code === 'Enter') {
      this.login()
    }
  }

  async login(): Promise<void> {
    const token = this.token.trim()
    if (!token) {
      this.message.error($t('_pleaseInputToken'))
      return
    }

    if (this.showImgToken) {
      const token = this.imageToken.trim()
      if (!token) {
        this.message.error('Please enter the image TOKEN')
        return
      }
      try {
        this.submitting = true
        const authorName = config.imageRepoUrl.split('/').at(-2)
        const res = await verifyToken(token, config.imageRepoUrl)
        if ((res?.data?.login ?? res?.data?.username) !== authorName) {
          this.message.error('Image Bad credentials')
          return
        }
        setImageToken(token)
      } catch {
      } finally {
        this.submitting = false
      }
    }

    this.submitting = true

    try {
      const res = await verifyToken(token)
      if (
        !isSelfDevelop &&
        (res?.data?.login ?? res?.data?.username) !== authorName
      ) {
        this.message.error('Bad credentials')
        throw new Error('Bad credentials')
      }
      setToken(token)

      try {
        createBranch('image').finally(() => {
          this.message.success($t('_tokenVerSuc'))
          removeWebsite().finally(() => {
            window.location.reload()
          })
        })
      } catch {
        removeToken()
        this.submitting = false
      }
    } catch {
      this.submitting = false
    }
  }
}
