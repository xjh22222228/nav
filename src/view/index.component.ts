import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import nav from '../data';
import { debounce } from '../utils';

@Component({
  selector: 'app-home',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class HomeComponent {

  constructor (private router: Router, private activatedRoute: ActivatedRoute) {}
  nav: Array<any> = nav;
  supportModal: boolean = false;
  id: number = 0;
  page: number = 0;
  list: any[] = [];
  search: string = '';
  showInput = false;
  searchLoading = false;

  ngOnInit () {
    const initList = () => {
      this.list = this.nav[this.page].nav[this.id].nav;
    };

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
      initList();
    });

    const recursionFind = () => {
      const that = this;
      let searchList = [{ nav: [] }];
      this.searchLoading = false;

      return function f(arr?: any[]) {
        arr = arr || that.nav;

        for (let i = 0; i < arr.length; i++) {

          if (Array.isArray(arr[i].nav)) {
            f(arr[i].nav);
          }

          if(arr[i].name) {
            const name = arr[i].name.toLocaleLowerCase();
            const desc = arr[i].desc.toLocaleLowerCase();
            const search = that.search.toLocaleLowerCase();
            if (~name.indexOf(search) || ~desc.indexOf(search)) {
              try {
                let result = Object.assign({}, arr[i]);
                const regex = new RegExp(`(${that.search})`, 'i');
                result.name = result.name.replace(regex, `$1`.bold())
                result.desc = result.desc.replace(regex, `$1`.bold())
                searchList[0].nav.push(result);
              } catch (err) {}
            }
          }
        }
        
        return searchList;
      };
    }

    this.handleSearch = debounce(() => {
      if (!this.search) {
        initList();
        this.searchLoading = false;
        return;
      }

      this.searchLoading = true;
      this.list = recursionFind()();
    }, 1000, false);
  }

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

  handleSearch() {}

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
    (<any>window).$.ripple('.ripple-btn', {
      multi: true,
      debug: false,
      opacity: .2,
    });
    try {
      document.getElementById('main').scrollTop = +(<any>window).sessionStorage.top || 0;
    } catch (e) {}
  }
}
