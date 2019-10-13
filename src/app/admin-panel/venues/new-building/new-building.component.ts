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

  roomCount = 1;

  constructor(
    private venueService: VenueService,
  ) {
  }

  get rooms() {
    return (this.form.get('rooms') as FormArray);
  }

  get latControl() {
    return (this.form.get('coordinates').get('lat') as FormControl);
  }

  get lngControl() {
    return (this.form.get('coordinates').get('lng') as FormControl);
  }

  uniqueNameValidator(): ValidatorFn {
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
    this.form = new FormGroup({
      buildingCode: new FormControl('', [Validators.required, this.uniqueNameValidator()]),
      rooms: new FormArray([
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

  addRoom() {
    this.rooms.push(new FormControl(++this.roomCount, [Validators.required]));
  }

  removeRoom() {
    if (this.roomCount === 0) {
      return;
    }
    this.rooms.removeAt(--this.roomCount);
  }

  canSubmit() {
    return this.form.valid && this.form.dirty;
  }

  submit() {
    const b = this.form.value;
    b.rooms.forEach(r => {
      this.venueService.addVenue(b.buildingCode, r, [b.coordinates.lat, b.coordinates.lng]);
    });
    this.venueService.insertVenue(b);
    this.form.markAsPristine();
    this.new.emit(b);
  }

}
