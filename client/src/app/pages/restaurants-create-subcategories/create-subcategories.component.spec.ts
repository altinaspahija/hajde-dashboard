import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSubcategoriesRestaurantsComponent } from './create-subcategories.component';

describe('CreateProductV2Component', () => {
  let component: CreateSubcategoriesRestaurantsComponent;
  let fixture: ComponentFixture<CreateSubcategoriesRestaurantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSubcategoriesRestaurantsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSubcategoriesRestaurantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
