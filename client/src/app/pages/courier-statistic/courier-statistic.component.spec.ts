import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierStatisticComponent } from './courier-statistic.component';

describe('CourierStatisticComponent', () => {
  let component: CourierStatisticComponent;
  let fixture: ComponentFixture<CourierStatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourierStatisticComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourierStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
