import { TimetableService } from './shared/timetable.service';
import { SharedService } from './shared/shared.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VenueService {

  venues: Array<any>;

  constructor(private sharedService: SharedService) { }


  updateVenues() {
    const req = this.sharedService.getVenues();
    req.subscribe((result: any) => {
      switch (result.responseCode) {
        case 'successful':
          this.venues = result.venues;
          this.venues.forEach(venue => {
            venue.coordinates = venue.coordinates.split(',');
          });
          break;
      }
    });
    return req;
  }

}
