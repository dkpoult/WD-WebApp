import {SharedService} from './shared.service';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {API} from './api';
import {UserService} from './user.service';
import {Building} from './models';

export interface VenueNode {
  index: number;
  code: string;
  name: string;
  nodeType: string;
  hasImage?: boolean;
  coordinates?: { lat: number, lng: number };
  children?: VenueNode[];
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
    const req = this.http.post(`${API.apiRoot}/venue/remove_venue`, body);
    req.subscribe();
    return req;
  }
}
