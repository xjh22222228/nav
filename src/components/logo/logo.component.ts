import { Component, Input } from '@angular/core'
import { isValidImg } from '../../utils'
import { authorName, branchName } from '../../services'

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent {
  @Input() src: string
  @Input() name: string
  @Input() colour: string
  @Input() size: number
  @Input() check: boolean = true

  hasError = true
  color = '#1890ff'
  url: string

  constructor() { }

  ngOnInit() {
    if (this.src?.startsWith('nav-')) {
      this.url = `https://raw.sevencdn.com/${authorName}/${branchName}/image/${this.src}`
    } else {
      this.url = this.src
    }
  }

  ngAfterViewInit() {
    if (!this.check) {
      this.hasError = false
      return
    }
    setTimeout(async() => {
      const isValid = await isValidImg(this.url)
      if (isValid) {
        this.hasError = false
      }
    }, 1000)
  }
}
