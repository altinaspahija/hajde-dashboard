import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSubcategoriesCompaniesComponent } from './create-subcategories.component';

describe('CreateProductV2Component', () => {
  let component: CreateSubcategoriesCompaniesComponent;
  let fixture: ComponentFixture<CreateSubcategoriesCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSubcategoriesCompaniesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSubcategoriesCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
