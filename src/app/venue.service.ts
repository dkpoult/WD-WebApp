import { SharedService } from './shared/shared.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VenueService {

  venues: Array<any>;

  constructor(private sharedService: SharedService) { }


  updateVenues() {
    this.sharedService.getVenues().subscribe((result: any) => {
      switch (result.responseCode) {
        case 'successful':
          this.venues = result.venues.map(e => e.buildingCode);
          break;
      }
    });
  }
}
