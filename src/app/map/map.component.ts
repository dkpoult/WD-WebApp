import { TimetableService } from './../shared/timetable.service';
import { VenueService } from './../venue.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  lat = -26.192805;
  lng = 28.030493;

  venues = this.venueService.venues;

  constructor(private venueService: VenueService, private timetableService: TimetableService) { }

  ngOnInit() {
    // TODO: Make this not retarded. Should not be a subscription. Spaghetti alert
    this.venueService.updateVenues().subscribe((result: any) => {
      switch (result.responseCode) {
        case 'successful':
          this.venues = result.venues;
          this.venues.forEach(venue => {
            venue.coordinates = venue.coordinates.split(',');
          });
          break;
      }
    });
  }
}
