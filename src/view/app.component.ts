import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import nav from '../../data';
import { webpLanguage } from '../../config';

@Component({
  selector: 'app-home',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class WebpComponent {

  constructor (private router: Router, private activatedRoute: ActivatedRoute) {}
  nav: Array<any> = nav;
  id: number = 0;
  page: number = 0;
  open: boolean = false;
  language: string[] = webpLanguage;

  ngOnInit () {
    this.activatedRoute.queryParams.subscribe(query => {
      const id = +query.id || 0;
      const page = +query.page || 0;
      if (page > this.nav.length - 1) {
        this.page = this.nav.length - 1;
        this.id = 0;
      } else {
        this.page = page;
        if (id <= this.nav[this.page].nav.length - 1) {
          this.id = id;
        } else {
          this.id = this.nav[this.page].nav.length - 1;
        }
      }
    });
  }

  handleSidebarNav (index) {
    const page = +this.activatedRoute.snapshot.queryParams.page || 0;
    this.router.navigate(['/app'], { 
      queryParams: {
        page,
        id: index,
      }
    });
  }

  handleCilckNav (index) {
    this.router.navigate(['/app'], {
      queryParams: {
        page: index,
      }
    });
    this.open = !this.open;
    (<any>window).$('.nav-open').slideUp(200);
  }

  handleToggleOpen() {
    this.open = !this.open;
    (<any>window).$('.nav-open').slideToggle(200);
  }

  handleToWebsite(item, index, event) {
    if (!Array.isArray(item.language)) {
      window.open(item.link);
      return;
    }
    const el = (<any>window).$('.bottom-slide');
    const $this = (<any>window).$(event.currentTarget);
    const len = el.length;
    for (let i = 0; i < len; i++) {
      if (i === index) {
        continue;
      }
      el.eq(i).removeClass('active');
    }
    $this.siblings('.bottom-slide').toggleClass('active')
  }
}
