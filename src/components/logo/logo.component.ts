import { Component, Input } from '@angular/core'
import { getCDN } from '../../services'

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent {
  @Input() src: string
  @Input() name: string
  @Input() colour: string = '#1890ff'
  @Input() size: number = 35
  @Input() check: boolean = true

  hasError = false
  url: string

  constructor() { }

  ngOnInit() {
    if (this.src?.startsWith('nav-')) {
      this.url = getCDN(this.src)
    } else {
      this.url = this.src
    }
  }

  onError() {
    this.hasError = true;
  }
}
