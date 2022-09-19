import { TestBed } from '@angular/core/testing';

import { AuthRestaurantGuard } from './auth-restaurant.guard';

describe('AuthRestaurantGuard', () => {
  let guard: AuthRestaurantGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthRestaurantGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
