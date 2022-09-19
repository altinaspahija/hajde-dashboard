import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarCompanyComponent } from './sidebar-company.component';

describe('SidebarCompanyComponent', () => {
  let component: SidebarCompanyComponent;
  let fixture: ComponentFixture<SidebarCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarCompanyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
