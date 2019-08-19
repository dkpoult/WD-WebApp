import { TestBed } from '@angular/core/testing';

import { VenueService } from './venue.service';

describe('VenueService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VenueService = TestBed.get(VenueService);
    expect(service).toBeTruthy();
  });
});
