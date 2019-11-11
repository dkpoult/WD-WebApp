import {Component, ElementRef, HostBinding, Input, OnDestroy} from '@angular/core';
import {MatFormFieldControl} from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {FocusMonitor} from '@angular/cdk/a11y';
import {VenueService} from 'src/app/shared/services/venue.service';

class Venue {
  constructor(public building: string, public floor: string, public room: string) {
  }
}

@Component({
  selector: 'app-venue-input',
  template: `
        <mat-autocomplete #buildingAuto="matAutocomplete">
            <mat-option *ngFor="let building of venues" [value]="building">
                {{building}}
            </mat-option>
        </mat-autocomplete>
        <div [formGroup]="form">
            <input class="building" formControlName="building" [matAutocomplete]="buildingAuto">
            <input class="floor" formControlName="floor">
            <input class="room" formControlName="room">
        </div>
    `,
  styles: [`
    div {
      display: flex;
    }
    input {
      border: none;
      background: none;
      padding: 0;
      outline: none;
      font: inherit;
      text-align: center;
    }
  `],
  providers: [{provide: MatFormFieldControl, useExisting: VenueInputComponent}],
})
export class VenueInputComponent implements OnDestroy, MatFormFieldControl<Venue> {
  static nextId = 0;
  @HostBinding('attr.aria-describedby') describedBy = '';

  form: FormGroup;
  venues = this.venueService.venues.map(e => e.buildingCode);
  stateChanges = new Subject<void>();
  @HostBinding() id = `venue-input-${VenueInputComponent.nextId++}`;
  ngControl = null;
  focused = false;
  errorState = false;
  controlType = 'venue-input';

  constructor(
    fb: FormBuilder,
    private fm: FocusMonitor,
    private elRef: ElementRef<HTMLElement>,
    private venueService: VenueService
    // @Optional() @Self() public ngControl: NgControl
  ) {
    fm.monitor(elRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
    this.form = fb.group({
      room: '',
      building: ''
    });
  }

  @Input()
  get value() {
    const v = this.form.value;
    return new Venue(v.building, v.floor, v.room);
  }

  set value(v) {
    v = v || new Venue('', '', '');
    this.form.setValue({building: v.building, floor: v.floor, room: v.room});
    this.stateChanges.next();
  }

  private _placeholder: string;

  @Input()
  get placeholder() {
    return this._placeholder;
  }

  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }

  get empty() {
    const n = this.form.value;
    return !n.building && !n.room;
  }

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  private _required = false;

  @Input()
  get required() {
    return this._required;
  }

  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  private _disabled = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.form.disable() : this.form.enable();
    this.stateChanges.next();
  }

  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent): void {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this.elRef.nativeElement.querySelector('input').focus();
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }
}
