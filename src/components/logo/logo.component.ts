import { Component, OnInit, Input } from '@angular/core'
import { isValidImg } from '../../utils'

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit {
  @Input() src: string
  @Input() name: string
  @Input() colour: string
  @Input() size: number

  hasError = true
  color = '#1890ff'

  constructor() { }

  async ngOnInit() {
    const isValid = await isValidImg(this.src)
    if (isValid) {
      this.hasError = false
    }
  }
}
