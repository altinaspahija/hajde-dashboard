import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetGroupsSelectComponent } from './target-groups-select.component';

describe('TargetGroupsSelectComponent', () => {
  let component: TargetGroupsSelectComponent;
  let fixture: ComponentFixture<TargetGroupsSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TargetGroupsSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetGroupsSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
