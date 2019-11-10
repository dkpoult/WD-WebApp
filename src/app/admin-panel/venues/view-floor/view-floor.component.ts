import {Component, Input, OnInit} from '@angular/core';
import {VenueNode, VenueService} from '../../../shared/services/venue.service';
import {AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {coerceNumberProperty} from '@angular/cdk/coercion';

@Component({
  selector: 'app-view-floor',
  templateUrl: './view-floor.component.html',
  styleUrls: ['./view-floor.component.scss']
})
export class ViewFloorComponent implements OnInit {

  form: FormGroup;
  imageURL: string;

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

  private _floorNode: VenueNode;

  get floorNode(): VenueNode {
    return this._floorNode;
  }

  @Input() set floorNode(value: VenueNode) {
    this._floorNode = value;
    this.form = new FormGroup({
      newFloorCode: new FormControl(this.floorNode.code, [Validators.required, this.uniqueCodeValidator(this.floorNode.code)]),
      floorName: new FormControl(this.floorNode.name, [Validators.required]),
      venues: new FormArray([], [Validators.required]),
      coordinates: new FormGroup({
        lat: new FormControl(this.lat, [Validators.required]),
        lng: new FormControl(this.lng, [Validators.required])
      })
    });
    for (const f of this.floorNode.children) {
      if (f.nodeType === 'new') {
        continue;
      }
      this.formVenues.push(new FormGroup({
        venueName: new FormControl(f.name, [Validators.required]),
        delete: new FormControl(false),
        old: new FormControl(true),
      }));
    }
  }

  filterDeleted = (item: any) => {
    return !item.value.delete;
  };

  venueName(venue) {
    return venue.get('venueName');
  }

  uniqueCodeValidator(oldCode: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let taken = false;
      const code = (control.value as string).toLowerCase();
      if (oldCode.toLowerCase() === code) {
        return null;
      }
      const venues = this.venueService.venues;
      if (!venues) {
        return null;
      } else {
        venues.forEach(v => {
          if (v.floorCode.toLowerCase() === code) {
            taken = true;
            return;
          }
        });
      }
      return taken ? {taken: true} : null;
    };
  }

  ngOnInit() {
  }

  setCoords(item) {
    this.latControl.setValue(item.lat);
    this.lngControl.setValue(item.lng);
    this.form.markAsDirty();
  }

  submit() {
    const v = this.form.value;
    v.venues = v.venues.filter(e => !e.delete);
    // this.venueService.updateFloor(this.floorNode.code, v);
    this.form.markAsPristine();
  }

  canSubmit() {
    return this.form.dirty && this.form.valid;
  }

  addVenue() {
    this.formVenues.push(new FormGroup({
      venueName: new FormControl('', [Validators.required]),
      delete: new FormControl(false)
    }));
  }

  deleteVenue(removed) {
    this.form.markAsDirty();
    if (removed.value.old) {
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

}
