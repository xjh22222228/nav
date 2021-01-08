import { Component } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import config from '../../nav.config'
import { queryString, setLocation } from '../utils'

@Component({
  selector: 'app-xiejiahe',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor (private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    document.title = config.title

    this.goRoute()
    this.appendTongji()

    this.activatedRoute.queryParams.subscribe(setLocation)
  }

  goRoute() {
    const { page, id, q } = queryString()
    const screenWidth = window.innerWidth
    const queryParams = { page, id, q }

    if (screenWidth < 768) {
      this.router.navigate(['/app'], { queryParams })
    }
  }

  appendTongji() {
    if (
      document.getElementById('tongji_url') ||
      window.location.hostname === 'localhost'
    ) return

    const script = document.createElement('script')
    script.src = config.tongjiUrl
    script.id = 'tongji_url'
    script.async = true
    document.head.appendChild(script)
  }
}
