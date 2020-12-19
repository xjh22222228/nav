import { Component, Input } from '@angular/core'
import { INDEX_LANGUAGE } from '../../../config'
import { INavFourProp } from '../../types'

@Component({
  selector: 'app-multiple-site',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class MultipleSiteComponent {
  @Input() dataSource: INavFourProp

  language: string[] = INDEX_LANGUAGE
}
