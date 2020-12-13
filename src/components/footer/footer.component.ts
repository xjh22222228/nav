import { Component, Input } from '@angular/core'
import { FOOTER_DESC } from '../../../config'
import { totalWeb } from '../../utils'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  FOOTER_DESC: string = FOOTER_DESC;
  totalWeb: number = totalWeb()

  @Input() className: string
}
