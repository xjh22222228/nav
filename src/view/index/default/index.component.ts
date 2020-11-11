import nav from '../../../../data';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { debounce, fuzzySearch } from '../../../utils';
import { appLanguage, GIT_REPO_URL } from '../../../../config';
import { annotate } from 'rough-notation';

let equeue = [];

@Component({
  selector: 'app-home',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export default class HomeComponent {

  constructor (private router: Router, private activatedRoute: ActivatedRoute) {}

  nav: any[] = nav;
  id: number = 0;
  page: number = 0;
  list: any[] = [];
  search: string = '';
  showInput = false;
  searchLoading = false;
  language: string[] = appLanguage;
  GIT_REPO_URL: string = GIT_REPO_URL;

  ngOnInit () {
    const that = this;
    const initList = () => {
      this.list = this.nav[this.page].nav[this.id].nav;
    };

    this.activatedRoute.queryParams.subscribe(query => {
      const tempPage = this.page;
      const id = +query.id || 0;
      const page = +query.page || 0;
      this.search = query.q || '';

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
      
      if (this.search) {
        this.list = fuzzySearch(this.nav, this.search);
        this.searchLoading = false;
      } else {
        initList();
      }

      if (tempPage !== page) {
        this.setAnnotate();
      }
    });

    this.handleSearch = debounce(() => {
      if (!this.search) {
        initList();
        this.searchLoading = false;
        return;
      }

      const hash = window.location.hash;
      const params = new URLSearchParams(hash.slice(hash.indexOf('?')));
      this.router.navigate(['/index'], {
        queryParams: {
          ...params,
          q: this.search
        }
      });

      this.searchLoading = true;
    }, 1000, false);
  }

  handleSearch = null

  handleScroll(e) {
    const target = e.target;
    const top = target.scrollTop;
    (<any>window).sessionStorage.top = top;
  }

  handleCilckNav(index) {
    this.router.navigate(['/index'], {
      queryParams: {
        page: index,
        _: Date.now()
      }
    });
  }

  handleOnClickSearch() {
    this.showInput = true;
    setTimeout(() => {
      try {
        (<any>document).querySelector('.search').focus();
      } catch (err) {}
    }, 0);
  }

  handleSidebarNav (index) {
    const page = +this.activatedRoute.snapshot.queryParams.page || 0;
    this.router.navigate(['/index'], { 
      queryParams: {
        page,
        id: index,
        _: Date.now()
      }
    });
  }

  ngAfterViewInit () {
    this.setAnnotate();

    (<any>window).$.ripple('.ripple-btn', {
      multi: true,
      debug: false,
      opacity: .2,
    });
    try {
      document.getElementById('main').scrollTop = +(<any>window).sessionStorage.top || 0;
    } catch (e) {}
  }

  setAnnotate() {
    const elList = document.querySelectorAll('.top-nav .ripple-btn') || [];
    if (elList.length === 0) return;

    equeue.forEach(item => item.hide());
    equeue = [];

    const annotation = annotate(elList[this.page], {
      type: 'underline',
      color: 'red',
      padding: 3,
      strokeWidth: 3
    });
    equeue.push(annotation);
    annotation.show();
  }

  onImgError = (e) => {
    e.target.src = 'assets/img/transparent.gif'
  }
}
