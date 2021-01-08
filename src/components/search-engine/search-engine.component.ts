import { Component, Output, EventEmitter } from '@angular/core'
import config from '../../../nav.config'
import { getDefaultSearchEngine, setDefaultSearchEngine, queryString } from '../../utils'

@Component({
  selector: 'app-search-engine',
  templateUrl: './search-engine.component.html',
  styleUrls: ['./search-engine.component.scss']
})
export class SearchEngineComponent {
  searchEngineList = config.searchEngineList

  currentEngine = getDefaultSearchEngine()

  showEngine = false

  keyword = queryString().q

  @Output() onSearch = new EventEmitter<string>()

  inputFocus() {
    const inputEl = document.getElementById('search-engine-input')
    inputEl?.focus?.()
  }

  ngAfterViewInit() {
    this.inputFocus()

    document.addEventListener('click', () => {
      this.toggleEngine(null, false)
    })
  }

  toggleEngine(e?: Event, isShow?: boolean) {
    if (this.searchEngineList.length <= 1) return

    if (e) {
      e.stopPropagation()
    }
    this.showEngine = typeof isShow === 'undefined'
      ? !this.showEngine
      : isShow
  }

  clickEngineItem(index) {
    this.currentEngine = config.searchEngineList[index]
    this.toggleEngine()
    this.inputFocus()
    setDefaultSearchEngine(this.currentEngine)
  }

  triggerSearch() {
    if (this.currentEngine.url) {
      window.open(this.currentEngine.url + this.keyword)
    }
    
    this.onSearch.emit(this.keyword)
  }

  onKey(event: KeyboardEvent) {
    if (event.code === 'Enter') {
      this.triggerSearch()
    }
  }
}
