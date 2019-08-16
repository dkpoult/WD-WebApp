import { isNullOrUndefined } from 'util';
import { TimetableService } from './../shared/timetable.service';
import { VenueService } from '../shared/venue.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { coerceNumberProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  lat = -26.190359;
  lng = 28.026833;
  // -26.190359, 28.026833
  zoom = 15;

  venues = this.venueService.venues;

  constructor(
    private venueService: VenueService,
    private timetableService: TimetableService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    let building = null;
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        params.getAll('building')
      )).subscribe((result: any) => {
        building = result;
      });
    // TODO: Make this not retarded. Should not be a subscription. Spaghetti alert
    this.venueService.updateVenues().subscribe((result: any) => {
      switch (result.responseCode) {
        case 'successful':
          this.venues = result.venues;
          this.venues.forEach((v: any) => {
            v.coordinates = v.coordinates.split(',');
          });
          const venue = this.venues.find((v) => v.buildingCode === building);
          if (!isNullOrUndefined(venue)) {
            this.zoom = 20;
            this.lat = coerceNumberProperty(venue.coordinates[0]);
            this.lng = coerceNumberProperty(venue.coordinates[1]);
          }
          break;
      }
    });
  }

  randomLocation() {
    this.lat = Math.random() * 180 - 90;
    this.lng = Math.random() * 360 - 180;
  }
}
