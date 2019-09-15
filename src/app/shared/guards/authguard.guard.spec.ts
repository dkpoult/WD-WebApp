import {inject, TestBed} from '@angular/core/testing';

import {AuthGuard} from './auth-guard.service';

describe('AuthguardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard]
    });
  });

  it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
