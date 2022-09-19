import { TestBed } from '@angular/core/testing';

import { CouriersService } from './couriers.service';

describe('CouriersService', () => {
  let service: CouriersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CouriersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
