import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {VenueService} from '../../../shared/services/venue.service';

@Component({
  selector: 'app-new-building',
  templateUrl: './new-building.component.html',
  styleUrls: ['./new-building.component.scss']
})
export class NewBuildingComponent implements OnInit {

  lat = -26.190359;
  lng = 28.026833;
  zoom = 15;

  form: FormGroup;

  @Output() new = new EventEmitter();

  floorCount = 1;

  constructor(
    private venueService: VenueService,
  ) {
  }

  get floors() {
    return (this.form.get('floors') as FormArray);
  }

  get latControl() {
    return (this.form.get('coordinates').get('lat') as FormControl);
  }

  get lngControl() {
    return (this.form.get('coordinates').get('lng') as FormControl);
  }

  uniqueCodeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let taken = false;
      const code = (control.value as string).toLowerCase();
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
    this.venueService.refreshVenues();
    this.form = new FormGroup({
      buildingCode: new FormControl('', [Validators.required, this.uniqueCodeValidator()]),
      buildingName: new FormControl('', [Validators.required]),
      floors: new FormArray([
        new FormControl('1', [Validators.required])
      ], [Validators.required]),
      coordinates: new FormGroup({
        lat: new FormControl(this.lat, [Validators.required]),
        lng: new FormControl(this.lng, [Validators.required])
      })
    });
  }

  log(item) {
    console.log(item);
  }

  setCoords(item) {
    this.form.get('coordinates').setValue(item);
  }

  addFloor() {
    this.floors.push(new FormControl(++this.floorCount, [Validators.required]));
  }

  removeFloor() {
    if (this.floorCount === 0) {
      return;
    }
    this.floors.removeAt(--this.floorCount);
  }

  canSubmit() {
    return this.form.valid && this.form.dirty;
  }

  submit() {
    const b = this.form.value;
    this.venueService.addBuilding(b);
    this.form.markAsPristine();
    this.new.emit(b);
  }

}
