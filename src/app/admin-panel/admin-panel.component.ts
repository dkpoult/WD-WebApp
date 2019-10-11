import { Component, OnInit } from '@angular/core';
import {VenueNode, VenueService} from '../shared/services/venue.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {

  constructor(
    private venueService: VenueService,
  ) { }

  ngOnInit() {
    this.venueService.updateVenues();
  }
}
