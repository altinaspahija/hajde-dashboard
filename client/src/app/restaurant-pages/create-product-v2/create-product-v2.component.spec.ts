import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProductV2Component } from './create-product-v2.component';

describe('CreateProductV2Component', () => {
  let component: CreateProductV2Component;
  let fixture: ComponentFixture<CreateProductV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProductV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProductV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
