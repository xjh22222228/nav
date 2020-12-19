import { Component, Output, EventEmitter, Input } from '@angular/core'
import { isDark as isDarkFn, randomBgImg } from '../../utils'

@Component({
  selector: 'app-fixbar',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class FixbarComponent {

  @Input() collapsed: boolean
  @Input() randomBg: boolean
  @Input() selector: string
  @Output() onCollapse = new EventEmitter()
  isDark: boolean = isDarkFn()

  ngOnInit() {
    if (isDarkFn()) {
      document.body.classList.add('dark-container')
    }
  }

  scrollTop() {
    if (this.selector) {
      const el = document.querySelector(this.selector)
      if (el) {
        el.scrollTop = 0
      }
      return
    }

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
    window.localStorage.setItem('IS_DARK', String(Number(this.isDark)))
    document.body.classList.toggle('dark-container')

    if (this.isDark) {
      const el = document.getElementById('random-light-bg')
      el?.parentNode?.removeChild?.(el)
    } else {
      this.randomBg && randomBgImg()
    }
  }
}
