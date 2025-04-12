// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { settings, components } from 'src/store'
import { ComponentType } from 'src/types'
import type { IComponentProps } from 'src/types'
import { CalendarComponent } from 'src/components/calendar/index.component'
import { RuntimeComponent } from 'src/components/runtime/index.component'
import { OffWorkComponent } from 'src/components/off-work/index.component'
import { ImageComponent } from 'src/components/image/index.component'
import { CountdownComponent } from 'src/components/countdown/index.component'
import { HTMLComponent } from 'src/components/html/index.component'
import { HolidayComponent } from 'src/components/holiday/index.component'
import { Subject } from 'rxjs'
import { debounceTime, takeUntil } from 'rxjs/operators'
import { NzIconModule } from 'ng-zorro-antd/icon'
import event from 'src/utils/mitt'
import { isMobile } from 'src/utils'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    CalendarComponent,
    RuntimeComponent,
    OffWorkComponent,
    ImageComponent,
    CountdownComponent,
    HTMLComponent,
    HolidayComponent,
    NzIconModule,
  ],
  selector: 'component-group',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class ComponentGroupComponent {
  @Input() direction: 'column' | '' = ''

  private windowResizeSubject = new Subject<Event>()
  private destroy$ = new Subject<void>()
  readonly isMobile = isMobile()
  ComponentType = ComponentType
  components: IComponentProps[] = []
  componentsLength: number = settings.components.length
  widths: number[] = []
  isShowAll = false
  isOver = false

  constructor() {
    this.windowResizeSubject
      .pipe(debounceTime(100), takeUntil(this.destroy$))
      .subscribe(() => {
        this.checkOver()
      })

    const c: IComponentProps[] = []
    // 按照系统设置顺序排序显示
    components.forEach((item) => {
      const has = settings.components.find(
        (c) => c.type === item.type && c.id === item.id
      )
      if (has) {
        c.push({
          ...item,
          ...has,
        })
      }
    })
    this.components = c

    event.on('COMPONENT_CHECK_OVER', () => {
      this.checkOver()
    })
  }

  get componentList() {
    if (this.isShowAll || this.componentsLength >= this.components.length) {
      return this.components
    }
    return this.components.slice(0, this.componentsLength)
  }

  ngAfterViewInit() {
    if (
      this.direction !== 'column' &&
      !this.isMobile &&
      this.components.length
    ) {
      requestAnimationFrame(() => {
        const items = document.querySelectorAll('.component-group .citems')
        const widths: number[] = []
        items.forEach((item) => {
          widths.push((item as HTMLElement).offsetWidth)
        })
        this.widths = widths
        this.checkOver()
        window.addEventListener('resize', this.windowResize.bind(this))
      })
    }
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.windowResize.bind(this))
    this.destroy$.next()
    this.destroy$.complete()
    event.off('COMPONENT_CHECK_OVER')
  }

  handleExpand() {
    this.isShowAll = !this.isShowAll
  }

  private windowResize(event: Event) {
    this.windowResizeSubject.next(event)
  }

  private checkOver() {
    requestAnimationFrame(() => {
      const box = document.querySelector('.component-group') as HTMLElement
      if (!box) return
      const boxWidth = box.clientWidth
      let itemsWidth = 0
      for (const [index, width] of this.widths.entries()) {
        itemsWidth += width
        if (width > 0) {
          if (index === 0) {
            itemsWidth += 10
          } else {
            itemsWidth += 15
          }
        }
        if (itemsWidth > boxWidth) {
          if (this.componentsLength === index) return
          const i = index
          this.componentsLength = i
          this.isShowAll = false
          this.isOver = true
          return
        }
      }
      this.isOver = false
      this.componentsLength = this.components.length
    })
  }

  trackByItem(i: number, item: any) {
    return item.id
  }
}
