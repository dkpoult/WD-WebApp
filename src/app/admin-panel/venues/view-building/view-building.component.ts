import {Component, Input, OnInit} from '@angular/core';
import {VenueNode, VenueService} from '../../../shared/services/venue.service';
import {API} from '../../../shared/services/api';
import {AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {coerceNumberProperty} from '@angular/cdk/coercion';

@Component({
  selector: 'app-view-building',
  templateUrl: './view-building.component.html',
  styleUrls: ['./view-building.component.scss']
})
export class ViewBuildingComponent implements OnInit {
  zoom = 15;
  form: FormGroup;
  imageURL: string;

  constructor(
    private venueService: VenueService,
    private snackBar: MatSnackBar,
  ) {
  }

  get lat(): number {
    return coerceNumberProperty(this.buildingNode.coordinates.lat);
  }

  get lng(): number {
    return coerceNumberProperty(this.buildingNode.coordinates.lng);
  }

  get floorCount() {
    return this.formFloors.length;
  }

  get formFloors() {
    return this.form.get('floors') as FormArray;
  }

  get latControl() {
    return (this.form.get('coordinates').get('lat') as FormControl);
  }

  get lngControl() {
    return (this.form.get('coordinates').get('lng') as FormControl);
  }

  private _buildingNode: VenueNode;

  get buildingNode(): VenueNode {
    return this._buildingNode;
  }

  @Input() set buildingNode(value: VenueNode) {
    this._buildingNode = value;
    this.form = new FormGroup({
      newBuildingCode: new FormControl(this.buildingNode.code, [Validators.required, this.uniqueCodeValidator(this.buildingNode.code)]),
      buildingName: new FormControl(this.buildingNode.name, [Validators.required]),
      floors: new FormArray([], [Validators.required]),
      coordinates: new FormGroup({
        lat: new FormControl(this.lat, [Validators.required]),
        lng: new FormControl(this.lng, [Validators.required])
      })
    });
    for (const f of this.buildingNode.children) {
      if (f.nodeType === 'new') {
        continue;
      }
      this.formFloors.push(new FormGroup({
        floorName: new FormControl(f.name, [Validators.required]),
        delete: new FormControl(false),
        old: new FormControl(true),
      }));
    }
  }

  filterDeleted = (item: any) => {
    return !item.value.delete;
  };

  floorName(floor) {
    return floor.get('floorName');
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
          if (v.buildingCode.toLowerCase() === code) {
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
    v.floors = v.floors.filter(e => !e.delete);
    this.venueService.updateBuilding(this.buildingNode.code, v);
    this.form.markAsPristine();
  }

  canSubmit() {
    return this.form.dirty && this.form.valid;
  }

  addFloor() {
    this.formFloors.push(new FormGroup({
      floorName: new FormControl('', [Validators.required]),
      delete: new FormControl(false)
    }));
  }

  deleteFloor(removed) {
    this.form.markAsDirty();
    if (removed.value.old) {
      // Just mark it as delete
      removed.get('delete').setValue(true);
      const snackBarRef = this.snackBar.open(`Removed ${removed.value.floorName}`, 'Undo', {duration: 15000});
      snackBarRef.onAction().subscribe(() => {
        removed.get('delete').setValue(false);
      });
    } else {
      const i = this.formFloors.controls.findIndex(e => e.value.floorName === removed.value.floorName);
      // Remove it from the form
      const snackBarRef = this.snackBar.open(`Removed ${removed.value.floorName}`, 'Undo', {duration: 15000});
      snackBarRef.onAction().subscribe(() => {
        this.formFloors.insert(i, removed);
      });
      this.formFloors.removeAt(i);
    }
  }
}
