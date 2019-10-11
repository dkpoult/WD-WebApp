import {SharedService} from './shared.service';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {API} from './api';
import {UserService} from './user.service';

export interface VenueNode {
  code: string;
  rooms?: VenueNode[];
  parent?: VenueNode;
}

@Injectable({
  providedIn: 'root'
})
export class VenueService {

  venues: any[];
  currentUser = this.userService.currentUser;
  private newVenuesSubject = new Subject<any>();
  newVenues$ = this.newVenuesSubject.asObservable();
  private  venueTreeSubject = new Subject<VenueNode[]>();
  venueTree$ = this.venueTreeSubject.asObservable();

  constructor(
    private sharedService: SharedService,
    private userService: UserService,
    private http: HttpClient,
  ) {
  }

  updateVenues() {
    const req = this.getVenues();
    req.subscribe((result: any) => {
      switch (result.responseCode) {
        case 'successful':
          result.venues.forEach(venue => {
            venue.coordinates = venue.coordinates.split(',');
          });
          this.venues = result.venues;
          this.newVenuesSubject.next(this.venues);
          this.venueTreeSubject.next(this.getVenueTree());
          break;
      }
    });
    return req;
  }

  getVenues() {
    // TODO: Move this out of sharedService
    return this.sharedService.getVenues();
  }

  addVenue(buildingCode: string, subCode: string) {
    const body = {
      venue: {
        buildingCode,
        subCode,
        coordinates: '+32.30642, -122.61458', // TODO: This is dummy coords
      },
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken
    };
    return this.http.post(`${API.apiRoot}/venue/add_venue`, body);
  }

  private getVenueTree(): VenueNode[] {
    if (!this.venues) {
      return null;
    }
    const venues = [];
    this.venues.forEach(venue => {
      // Find the current venue's buildingCode in the list of venues
      let p = venues.find(v => v.code === venue.buildingCode);
      // and add the subCode to the room list
      if (!p) {
        p = {code: venue.buildingCode, rooms: []};
        venues.push(p);
      }
      p.rooms.push({code: venue.subCode, parent: p});
      p.rooms.sort((a, b) => (a.code > b.code) ? 1 : (a.code < b.code) ? -1 : 0);
    });
    return venues;
  }

}
