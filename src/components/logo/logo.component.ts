import { Component, OnInit, Input } from '@angular/core'

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

  hasError = false
  color = '#1890ff'

  constructor() { }

  ngOnInit(): void {
  }

  onImgError = () => {
    this.hasError = true
  }
}
