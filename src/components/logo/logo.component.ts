import { Component, Input } from '@angular/core'
import { isValidImg } from '../../utils'

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

  hasError = true
  color = '#1890ff'

  constructor() { }

  ngAfterViewInit() {
    setTimeout(async() => {
      const isValid = await isValidImg(this.src)
      if (isValid) {
        this.hasError = false
      }
    }, 1000)
  }
}
