import {TimetableService} from '../shared/services/timetable.service';
import {VenueService} from '../shared/services/venue.service';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {Building} from '../shared/services/models';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  lat = -26.190359;
  lng = 28.026833;
  zoom = 15;

  filteredVenues: Building[];

  constructor(
    private venueService: VenueService,
    private timetableService: TimetableService,
    private route: ActivatedRoute
  ) {
  }

  private _venues = this.venueService.venues;

  get venues() {
    return this._venues;
  }

  set venues(v) {
    this.filteredVenues = v.filter(e => !!e.coordinates);
    this._venues = v;
  }

  ngOnInit() {
    let building = null;
    // TODO: This needs to update to new style of venue
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        params.getAll('building')
      )).subscribe((result: any) => {
      building = result;
    });
    this.venueService.newVenues$.subscribe((result: any) => {
      this.venues = result;
      console.log(this.venues);
    });
    this.venueService.refreshVenues();
  }
}
