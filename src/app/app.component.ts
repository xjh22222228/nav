import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import nav from '../data';

@Component({
  selector: 'app-xiejiahe',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor (private router: Router, private activatedRoute: ActivatedRoute) {}
  nav: Array<any> = nav;
  page: number = 0;

  ngOnInit () {
    const screenWidth = window.innerWidth;
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.slice(hash.indexOf('?')));
    const page = params.get('page');
    const id = params.get('id');
    const queryParams = {
      page,
      id
    };

    if (screenWidth < 768) {
      this.router.navigate(['/app'], { queryParams });
    } else {
      this.router.navigate(['/index'], { queryParams });
    }
    
    this.activatedRoute.queryParams.subscribe(query => {
      const page = +query.page || 0;
      if (page > this.nav.length - 1) {
        this.page = this.nav.length - 1;
      } else {
        this.page = page;
      }
    });
  }
}
