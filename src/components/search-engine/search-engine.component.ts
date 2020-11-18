import { Component, OnInit } from '@angular/core'
import { SEARCH_ENGINE_LIST } from '../../../config'
import { getDefaultSearchEngine, setDefaultSearchEngine } from '../../utils'

@Component({
  selector: 'app-search-engine',
  templateUrl: './search-engine.component.html',
  styleUrls: ['./search-engine.component.scss']
})
export class SearchEngineComponent implements OnInit {
  SEARCH_ENGINE_LIST = SEARCH_ENGINE_LIST

  currentEngine = getDefaultSearchEngine()

  showEngine = false

  keyword = ''

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    const inputEl = document.getElementById('search-engine-input')
    if (inputEl) {
      inputEl.focus()
    }
  }

  toggleEngine() {
    this.showEngine = !this.showEngine
  }

  clickEngineItem(index) {
    this.currentEngine = SEARCH_ENGINE_LIST[index]
    this.toggleEngine()
    setDefaultSearchEngine(this.currentEngine)
  }

  onSearch() {
    window.open(this.currentEngine.url + this.keyword)
  }

  onKey(event: KeyboardEvent) {
    if (event.code === 'Enter') {
      this.onSearch()
    }
  }
}
