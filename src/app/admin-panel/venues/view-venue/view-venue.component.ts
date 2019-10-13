import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VenueNode, VenueService} from '../../../shared/services/venue.service';
import {API} from '../../../shared/services/api';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {coerceNumberProperty} from '@angular/cdk/coercion';

@Component({
  selector: 'app-view-venue',
  templateUrl: './view-venue.component.html',
  styleUrls: ['./view-venue.component.scss']
})
export class ViewVenueComponent implements OnInit {

  zoom = 15;
  get lat(): number { return coerceNumberProperty(this.venue.coordinates[0]); }
  get lng(): number { return coerceNumberProperty(this.venue.coordinates[1]); }

  form: FormGroup;
  imageURL: string;

  constructor(
    private venueService: VenueService,
    private snackBar: MatSnackBar,
  ) {
  }

  get formRooms() {
    return this.form.get('rooms') as FormArray;
  }

  get latControl() {
    return (this.form.get('coordinates') as FormArray).at(0);
  }

  get lngControl() {
    return (this.form.get('coordinates') as FormArray).at(1);
  }

  private _venue: VenueNode;

  get venue(): VenueNode {
    return this._venue;
  }

  @Input() set venue(value: VenueNode) {
    this._venue = value;

    this.form = new FormGroup({
      buildingCode: new FormControl(this.venue.code, [Validators.required]),
      oldBuildingCode: new FormControl(this.venue.code),
      coordinates: new FormArray([
        new FormControl(this.venue.coordinates[0], [Validators.required]),
        new FormControl(this.venue.coordinates[1], [Validators.required])
      ]),
      rooms: new FormArray([], [Validators.required])
    });
    for (const r of this.venue.rooms) {
      this.formRooms.push(new FormGroup({
        newCode: new FormControl(r.code, [Validators.required]),
        oldCode: new FormControl(r.code),
        delete: new FormControl(false)
      }));
    }
  }

  filterDeleted = (item: any) => {
    return !item.value.delete;
  };

  ngOnInit() {
    const building = `buildingCode=${this.venue.parent ? this.venue.parent.code : this.venue.code}`;
    const room = `subCode=${this.venue.parent ? this.venue.code : 'building'}`;
    this.imageURL = `${API.apiRoot}/venue/get_venue_image?${building}&${room}`;
  }

  setCoords(item) {
    this.latControl.setValue(item.lat);
    this.lngControl.setValue(item.lng);
    this.form.markAsDirty();
  }

  submit() {
    const v = this.form.value;
    for (const r of v.rooms) {
      if (r.delete && r.oldCode) {
        // Deleting an existing venue
        this.venueService.deleteVenue(v.oldBuildingCode, r.oldCode);
      } else if (r.oldCode) {
        // Updating an existing venue
        this.venueService.editVenue(v.oldBuildingCode, r.oldCode, v.coordinates, v.buildingCode, r.newCode);
      } else {
        // Adding a new venue
        this.venueService.addVenue(v.buildingCode, r.newCode, v.coordinates);
      }
    }
    this.form.markAsPristine();
    this.venueService.updateVenues();
  }

  canSubmit() {
    return this.form.dirty && this.form.valid;
  }

  saveRoom(room: VenueNode, newCode) {
    this.venueService.editVenue(room.parent.code, room.code, undefined, undefined, newCode).subscribe((r: any) => {
      switch (r.responseCode) {
        case 'successful':
          room.code = newCode;
          break;
      }
    });
  }

  addRoom() {
    this.formRooms.push(new FormGroup({
      newCode: new FormControl('', [Validators.required]),
      delete: new FormControl(false)
    }));
  }

  deleteRoom(i: number) {
    // this.venueService.deleteVenue(room.parent.code, room.code);
    this.form.markAsDirty();
    const removed = this.formRooms.at(i);
    const snackBarRef = this.snackBar.open(`Removed room ${removed.value.newCode}`, 'Undo', {duration: 2000});
    snackBarRef.onAction().subscribe(() => {
      this.formRooms.insert(i, removed);
    });
    this.formRooms.removeAt(i);
  }
}
