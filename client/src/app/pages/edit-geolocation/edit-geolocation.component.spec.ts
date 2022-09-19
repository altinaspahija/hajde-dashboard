import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGeolocationComponent } from './edit-geolocation.component';

describe('EditGeolocationComponent', () => {
  let component: EditGeolocationComponent;
  let fixture: ComponentFixture<EditGeolocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditGeolocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGeolocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
