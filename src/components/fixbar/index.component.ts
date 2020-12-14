import { Component, Output, EventEmitter, Input } from '@angular/core'

@Component({
  selector: 'app-fixbar',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class FixbarComponent {

  @Input() collapsed: boolean
  @Output() onCollapse = new EventEmitter()
  isDark: boolean = false

  scrollTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  collapse() {
    this.onCollapse.emit()
  }

  toggleMode() {
    this.isDark = !this.isDark
  }
}
