import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGeolocationComponent } from './create-geolocation.component';

describe('CreateGeolocationComponent', () => {
  let component: CreateGeolocationComponent;
  let fixture: ComponentFixture<CreateGeolocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateGeolocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGeolocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
