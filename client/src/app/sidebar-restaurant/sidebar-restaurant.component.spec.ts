import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarRestaurantComponent } from './sidebar-restaurant.component';

describe('SidebarRestaurantComponent', () => {
  let component: SidebarRestaurantComponent;
  let fixture: ComponentFixture<SidebarRestaurantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarRestaurantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
