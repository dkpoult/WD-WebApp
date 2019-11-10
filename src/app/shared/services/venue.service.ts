import {SharedService} from './shared.service';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {API} from './api';
import {UserService} from './user.service';
import {Building} from './models';
import {HttpParamsOptions} from '@angular/common/http/src/params';

export interface VenueNode {
  code: string;
  name: string;
  nodeType: string;
  hasImage?: boolean;
  coordinates?: { lat: number, lng: number } & { x: number, y: number };
  children?: VenueNode[];
  parent?: VenueNode;
  attributes?: { [key: string]: any };
  level?: number;
}

@Injectable({
  providedIn: 'root'
})
export class VenueService {

  venues: any[];
  currentUser = this.userService.currentUser;
  private newVenuesSubject = new Subject<any>();
  newVenues$ = this.newVenuesSubject.asObservable();
  private requestNum = 0;

  constructor(
    private sharedService: SharedService,
    private userService: UserService,
    private http: HttpClient,
  ) {
  }

  insertBuilding(v) {
    this.venues.push(v);
    this.newVenuesSubject.next(this.venues);
  }

  replaceBuilding(code: string, newBuilding: Building) {
    // Find building with the right code, and set it to match newBuilding
    const old: Building = this.venues.find((e: Building) => e.buildingCode === code);
    old.buildingName = newBuilding.buildingName;
    old.coordinates = newBuilding.coordinates;
    old.floors = newBuilding.floors;
    this.newVenuesSubject.next(this.venues);
  }

  refreshVenues() {
    const req = this.getBuildings();
    req.subscribe((result: any) => {
      switch (result.responseCode) {
        case 'successful':
          this.venues = result.venues;
          this.newVenuesSubject.next(this.venues);
          break;
      }
    });
    return req;
  }

  addBuilding(b) {
    const {personNumber, userToken} = this.currentUser;
    const {buildingCode, buildingName, floors, coordinates} = b;
    const body = {
      personNumber,
      userToken,
      buildingCode,
      buildingName,
      floors,
      coordinates
    };
    const req = this.http.post(`${API.apiRoot}/venue/add_building`, body);
    req.subscribe((result: any) => {
      if (result.responseCode === 'successful') {
        this.insertBuilding(b);
      }
    });
    return req;
  }

  updateBuilding(oldBuildingCode: string, building: Building) {
    const {personNumber, userToken} = this.currentUser;
    const {buildingCode, buildingName, floors, coordinates} = building;

    const body = {
      buildingCode: oldBuildingCode,
      buildingName,
      floors: floors.map(e => e.floorName),
      newBuildingCode: buildingCode === oldBuildingCode ? undefined : buildingCode,
      coordinates,
      personNumber,
      userToken
    };

    const req = this.http.post(`${API.apiRoot}/venue/update_building`, body);
    req.subscribe((result: any) => {
      if (result.responseCode === 'successful') {
        this.replaceBuilding(oldBuildingCode, building);
      }
    });
    return req;
  }

  getBuildings() {
    const {personNumber, userToken} = this.currentUser;
    const body = {
      personNumber,
      userToken,
    };
    return this.http.post(`${API.apiRoot}/venue/get_buildings`, body);
  }

  deleteVenue(buildingCode: string, subCode: string) {
    const body = {
      buildingCode,
      subCode,
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken
    };
    const req = this.http.post(`${API.apiRoot}/venue/remove_venue`, body);
    req.subscribe();
    return req;
  }

  getImage(buildingCode, floor, venue?) {
    return API.apiRoot + '/venue/get_venue_image?' +
      'buildingCode=' + buildingCode +
      '&floor=' + floor +
      (venue ? `&venueCode=${venue}` : '') +
      '&i=' + this.requestNum.toString(10);
  }

  setImage(files, buildingCode, floor, venue?) {
    const {personNumber, userToken} = this.currentUser;
    const url = API.apiRoot + '/venue/set_venue_image?' +
      'buildingCode=' + buildingCode +
      '&floor=' + floor +
      (venue ? `&venueCode=${venue}` : '') +
      '&personNumber=' + personNumber +
      '&userToken=' + userToken;

    const image = files.item(0);

    const formData = new FormData();
    formData.append('image', image, image.name);

    const req = this.http.post(url, formData);
    req.subscribe(e => {
      this.requestNum++;
    });
    return req;
  }

  removeVenue(buildingCode: string, floor: number, venueCode: any) {
    const {personNumber, userToken} = this.currentUser;
    const body = {personNumber, userToken, buildingCode, floor, venueCode};
    const req = this.http.post(`${API.apiRoot}/venue/remove_venue`, body);
    req.subscribe(() => this.refreshVenues());
    return req;
  }

  updateVenue(buildingCode: string, floor: number, venueCode: any, venue: any) {
    const {personNumber, userToken} = this.currentUser;
    const {venueName, newVenueCode, coordinates, attributes} = venue;
    const body = {
     personNumber,
     userToken,
     venueName,
     newVenueCode: newVenueCode === venueCode ? undefined : newVenueCode,
     coordinates,
     attributes,
     buildingCode,
     floor,
     venueCode,
    };

    const req = this.http.post(`${API.apiRoot}/venue/update_venue`, body);
    req.subscribe(() => this.refreshVenues());
    return req;
  }

  addVenue(buildingCode: string, floor: number, venue: any) {
    const {personNumber, userToken} = this.currentUser;
    const {venueName, venueCode, coordinates, attributes} = venue;
    const body = {
      personNumber,
      userToken,
      venueName,
      venueCode,
      coordinates,
      attributes,
      buildingCode,
      floor,
    };
    const req = this.http.post(`${API.apiRoot}/venue/add_venue`, body);
    req.subscribe(() => this.refreshVenues());
    return req;
  }
}
