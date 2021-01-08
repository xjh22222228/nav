import { Component, Input } from '@angular/core'
import config from '../../../nav.config'
import { totalWeb } from '../../utils'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  footerCopyright: string = config.footerCopyright;
  totalWeb: number = totalWeb()

  @Input() className: string
}
