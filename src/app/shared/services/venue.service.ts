import {SharedService} from './shared.service';
import {Injectable} from '@angular/core';
import {interval, Subject, Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {API} from './api';
import {UserService} from './user.service';
import {startWith, switchMap} from 'rxjs/operators';
import {forEach} from '@angular/router/src/utils/collection';

export interface VenueNode {
  code: string;
  hasImage: boolean;
  rooms?: VenueNode[];
  parent?: VenueNode;
  coordinates?: number[];
}

@Injectable({
  providedIn: 'root'
})
export class VenueService {

  venues: any[];
  currentUser = this.userService.currentUser;
  pollingInterval = 15000;
  private newVenuesSubject = new Subject<any>();
  newVenues$ = this.newVenuesSubject.asObservable();
  private venueTreeSubject = new Subject<VenueNode[]>();
  venueTree$ = this.venueTreeSubject.asObservable();

  constructor(
    private sharedService: SharedService,
    private userService: UserService,
    private http: HttpClient,
  ) {
  }

  set venueTree(v) {
    console.log('Setting', v);
    this.venueTreeSubject.next(v);
  }

  insertVenue(v) {
    if (v.rooms) {
      v.rooms.forEach(r => {
        this.venues.push({buildingCode: v.buildingCode, subCode: r, hasImage: false});
      });
    }
    const t = this.getVenueTree();
    console.log('Tree:', t);
    this.venueTreeSubject.next(t);
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

  addVenue(buildingCode: string, subCode: string, coordinates: number[]) {
    const body = {
      buildingCode,
      subCode,
      coordinates: coordinates.join(','),
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken
    };
    const req = this.http.post(`${API.apiRoot}/venue/add_venue`, body);
    req.subscribe();
    return req;
  }

  editVenue(buildingCode: string, subCode: string,
            coordinates: number[] | undefined, newBuildingCode: string | undefined, newSubCode: string | undefined) {
    const body = {
      buildingCode,
      subCode,
      coordinates: coordinates.join(','),
      newBuildingCode: newBuildingCode === buildingCode ? undefined : newBuildingCode,
      newSubCode: newSubCode === subCode ? undefined : newSubCode,
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken
    };
    const req = this.http.post(`${API.apiRoot}/venue/update_venue`, body);
    req.subscribe();
    return req;
  }

  deleteVenue(buildingCode: string, subCode: string) {
    const body = {
      buildingCode,
      subCode,
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken
    };
    return this.http.post(`${API.apiRoot}/venue/remove_venue`, body);
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
        p = {code: venue.buildingCode, hasImage: false, coordinates: venue.coordinates, rooms: []};
        venues.push(p);
      }
      p.rooms.push({code: venue.subCode, hasImage: venue.hasImage, parent: p});
      // p.rooms.sort((a, b) => (a.code > b.code) ? 1 : (a.code < b.code) ? -1 : 0);
    });
    return venues;
  }

}
