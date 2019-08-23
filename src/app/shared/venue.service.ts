import { TimetableService } from './timetable.service';
import { SharedService } from './shared.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VenueService {

  venues: Array<any>;
  private newVenuesSubject = new Subject<any>();
  newVenues$ = this.newVenuesSubject.asObservable();

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
          this.newVenuesSubject.next(this.venues);
          break;
      }
    });
    return req;
  }

}
