import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportMenusComponent } from './import-menus.component';

describe('ImportMenusComponent', () => {
  let component: ImportMenusComponent;
  let fixture: ComponentFixture<ImportMenusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportMenusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportMenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
