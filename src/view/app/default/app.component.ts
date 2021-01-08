import nav from '../../../../data'
import { Component } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import config from '../../../../nav.config'
import { onImgError, queryString } from '../../../utils'
import { INavProps } from '../../../types'

@Component({
  selector: 'app-home',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export default class WebpComponent {

  constructor (private router: Router, private activatedRoute: ActivatedRoute) {}
  nav: INavProps[] = nav
  id: number = 0
  page: number = 0
  open: boolean = false
  language: string[] = config.appLanguage

  ngOnInit () {
    this.activatedRoute.queryParams.subscribe(() => {
      const { page, id } = queryString()
      this.page = page
      this.id = id
    })
  }

  handleSidebarNav (index) {
    const { page } = queryString()
    this.router.navigate(['/app'], { 
      queryParams: {
        page,
        id: index,
      }
    })
  }

  handleCilckNav (index) {
    this.router.navigate(['/app'], {
      queryParams: {
        page: index,
      }
    })
    this.open = !this.open;
    (<any>window).$('.nav-open').slideUp(200)
  }

  handleToggleOpen() {
    this.open = !this.open;
    (<any>window).$('.nav-open').slideToggle(200)
  }

  handleToWebsite(item, index, event) {
    if (!Array.isArray(item.language)) {
      window.open(item.url)
      return
    }
    const el = (<any>window).$('.bottom-slide')
    const $this = (<any>window).$(event.currentTarget)
    const len = el.length
    for (let i = 0; i < len; i++) {
      if (i === index) {
        continue
      }
      el.eq(i).removeClass('active')
    }
    $this.siblings('.bottom-slide').toggleClass('active')
  }

  onImgError = onImgError
}
