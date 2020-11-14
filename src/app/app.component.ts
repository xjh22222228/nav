import nav from '../../data'
import { Component } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { TONGJI_URL } from '../../config'

@Component({
  selector: 'app-xiejiahe',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  nav: Array<any> = nav

  constructor (private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    const hash = window.location.hash
    const params = new URLSearchParams(hash.slice(hash.indexOf('?')))
    const page = params.get('page')
    const id = params.get('id')
    const q = params.get('q')
    const queryParams = { page, id, q }

    this.goRoute(queryParams)
    this.appendTongji()
  }

  goRoute(queryParams: object) {
    const screenWidth = window.innerWidth

    if (screenWidth < 768) {
      this.router.navigate(['/app'], { queryParams })
    } else {
      this.router.navigate(['/index'], { queryParams })
    }
  }

  appendTongji() {
    if (document.getElementById('tongji_url')) return

    const script = document.createElement('script')
    script.src = TONGJI_URL
    script.id = 'tongji_url'
    script.async = true
    document.head.appendChild(script)
  }
}
