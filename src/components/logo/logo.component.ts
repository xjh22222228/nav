// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
})
export class LogoComponent {
  @Input() src: string = ''
  @Input() name: string = ''
  @Input() size: number = 35
  @Input() radius: number = 3
  @Input() check: boolean = true

  constructor() {}

  ngOnInit() {}
}
