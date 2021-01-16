import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelComponent } from './del.component';

describe('DelComponent', () => {
  let component: DelComponent;
  let fixture: ComponentFixture<DelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
