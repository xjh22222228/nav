import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import nav from '../../data';
import { BACKGROUND_LINEAR, git, caseNumber } from '../../config';
import { randomInt } from '../utils';

@Component({
  selector: 'app-xiejiahe',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor (private router: Router, private activatedRoute: ActivatedRoute) {}
  nav: Array<any> = nav;
  includeTotal: number = 0;
  git: string = git;
  caseNumber: string = caseNumber;

  ngOnInit() {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.slice(hash.indexOf('?')));
    const page = params.get('page');
    const id = params.get('id');
    const q = params.get('q');
    const queryParams = { page, id, q };

    this.goRoute(queryParams);
    
    this.computedTotal();
  }

  ngAfterViewInit() {
    setInterval(this.setBackground, 10000);
  }

  goRoute(queryParams: object) {
    const screenWidth = window.innerWidth;

    if (screenWidth < 768) {
      this.router.navigate(['/app'], { queryParams });
    } else {
      this.router.navigate(['/index'], { queryParams });
    }
  }

  // 计算收录个数
  computedTotal() {
    let total = 0;
    function r(nav) {
      if (!Array.isArray(nav)) return;
      for (let i = 0; i < nav.length; i++) {
        if (nav[i].link) {
          total += 1;
        } else {
          r(nav[i].nav);
        }
      }
    }
    r(this.nav);
    this.includeTotal = total;
  }

  setBackground() {
    const randomBg = BACKGROUND_LINEAR[randomInt(BACKGROUND_LINEAR.length)];
    const el = document.getElementById('index-background');
    if (!el) return;
    el.style.opacity = '.3';
    setTimeout(() => {
      el.style.backgroundImage = randomBg;
      el.style.opacity = '1';
    }, 1000);
  }
}
