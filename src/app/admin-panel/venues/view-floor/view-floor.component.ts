import {Component, Input, OnInit} from '@angular/core';
import {VenueNode, VenueService} from '../../../shared/services/venue.service';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {coerceNumberProperty} from '@angular/cdk/coercion';
import {API} from '../../../shared/services/api';

export function toTitleCase(str: string) {
  return str.replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^(.)/, (s) => s.toUpperCase());
}
export function toCamelCase(str) {
  return str
    .replace(/[^\w\s]|_/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s(.)/g, s => s.toUpperCase())
    .replace(/\s/g, '')
    .replace(/^(.)/, s => s.toLowerCase());
}

@Component({
  selector: 'app-view-floor',
  templateUrl: './view-floor.component.html',
  styleUrls: ['./view-floor.component.scss']
})
export class ViewFloorComponent implements OnInit {
  constructor(
    private venueService: VenueService,
    private snackBar: MatSnackBar,
  ) {
  }

  get lat(): number {
    return coerceNumberProperty(this.floorNode.coordinates.lat);
  }

  get lng(): number {
    return coerceNumberProperty(this.floorNode.coordinates.lng);
  }

  get venueCount() {
    return this.formVenues.length;
  }

  get formVenues() {
    return this.form.get('venues') as FormArray;
  }

  get latControl() {
    return (this.form.get('coordinates').get('lat') as FormControl);
  }

  get lngControl() {
    return (this.form.get('coordinates').get('lng') as FormControl);
  }

  get floorNode(): VenueNode {
    return this._floorNode;
  }

  @Input() set floorNode(value: VenueNode) {
    this._floorNode = value;
    this.form = new FormGroup({
      floorName: new FormControl(this.floorNode.name, [Validators.required]),
      venues: new FormArray([]),
    });
    for (const v of this.floorNode.children) {
      if (v.nodeType === 'new') {
        continue;
      }
      const venue = new FormGroup({
        venueName: new FormControl(v.name, [Validators.required]),
        venueCode: new FormControl(v.code, [Validators.required]),
        // TODO: image,
        // attributes: new FormControl(v.attributes),
        coordinates: new FormGroup({
          x: new FormControl(v.coordinates.x, [Validators.required]),
          y: new FormControl(v.coordinates.y, [Validators.required]),
        }),
        delete: new FormControl(false),
        node: new FormControl(v),
      });
      const control = [];
      Object.keys(v.attributes).map(key => {
        control.push(new FormGroup({
          name: new FormControl(toTitleCase(key)),
          value: new FormControl(v.attributes[key]),
        }));
      });
      venue.addControl('attributes', new FormArray(control));
      this.formVenues.push(venue);
    }
  }

  form: FormGroup;

  panelOpenState = false;

  private _floorNode: VenueNode;

  attributes(venue) {
    return venue.get('attributes') as FormArray;
  }

  filterDeleted = (item: any) => {
    return !item.value.delete;
  };

  venueName(venue) {
    return venue.get('venueName');
  }

  ngOnInit() {
  }

  setCoords(item) {
    this.latControl.setValue(item.lat);
    this.lngControl.setValue(item.lng);
    this.form.markAsDirty();
  }

  submit() {
    const value = this.form.value;
    const buildingCode = this.floorNode.parent.code;
    const floor = this.floorNode.level;

    for (let venue of value.venues) {
      if (!venue.node) {
        // add venue
        const attributes = {};
        for (const att of venue.attributes) {
          attributes[toCamelCase(att.name)] = att.value;
        }
        venue = {attributes, coordinates: venue.coordinates, venueName: venue.venueName, venueCode: venue.venueCode};
        this.venueService.addVenue(buildingCode, floor, venue);
      } else {
        const venueCode = venue.node.code;
        if (venue.delete) {
          this.venueService.removeVenue(buildingCode, floor, venueCode);
        } else {
          const attributes = {};
          for (const att of venue.attributes) {
            attributes[toCamelCase(att.name)] = att.value;
          }
          venue = {attributes, coordinates: venue.coordinates, venueName: venue.venueName, newVenueCode: venue.venueCode};
          this.venueService.updateVenue(buildingCode, floor, venueCode, venue);
        }
      }
    }
    this.form.markAsPristine();
  }

  canSubmit() {
    return this.form.dirty && this.form.valid;
  }

  addVenue() {
    this.formVenues.push(new FormGroup({
      venueName: new FormControl('', [Validators.required]),
      venueCode: new FormControl('', [Validators.required]),
      coordinates: new FormGroup({
        x: new FormControl('', [Validators.required]),
        y: new FormControl('', [Validators.required]),
      }),
      attributes: new FormArray([]),
      delete: new FormControl(false),
    }));
  }

  addAttribute(venue) {
    this.attributes(venue).push(new FormGroup({
      name: new FormControl('', [Validators.required]),
      value: new FormControl('', [Validators.required])
    }));
    this.form.markAsDirty();
  }

  deleteVenue(removed) {
    this.form.markAsDirty();
    if (removed.value.node) {
      // Just mark it as delete
      removed.get('delete').setValue(true);
      const snackBarRef = this.snackBar.open(`Removed ${removed.value.venueName}`, 'Undo', {duration: 15000});
      snackBarRef.onAction().subscribe(() => {
        removed.get('delete').setValue(false);
      });
    } else {
      const i = this.formVenues.controls.findIndex(e => e.value.venueName === removed.value.venueName);
      // Remove it from the form
      const snackBarRef = this.snackBar.open(`Removed ${removed.value.venueName}`, 'Undo', {duration: 15000});
      snackBarRef.onAction().subscribe(() => {
        this.formVenues.insert(i, removed);
      });
      this.formVenues.removeAt(i);
    }
  }

  getFullCode(venue: any) {
    venue = venue.value;
    return `${this.floorNode.parent.code} ${venue.venueCode} - ${venue.venueName}`;
  }

  findPin(coordinates) {
    console.log(coordinates);
  }

  onFileChange(venue, file) {
    if (!venue) {
      this.venueService.setImage(file, this.floorNode.parent.code, this.floorNode.level);
      this.floorNode.hasImage = true;
      console.log(this.floorNode);
    } else {
      this.venueService.setImage(file, this.floorNode.parent.code, this.floorNode.level, venue.value.node.code);
    }
  }

  getImage(building?, floor?, venue?) {
      return this.venueService.getImage(building, floor, venue);
  }
}
