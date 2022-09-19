import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyOrderNewComponent } from './company-order-new.component';

describe('CompanyOrderNewComponent', () => {
  let component: CompanyOrderNewComponent;
  let fixture: ComponentFixture<CompanyOrderNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyOrderNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyOrderNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
