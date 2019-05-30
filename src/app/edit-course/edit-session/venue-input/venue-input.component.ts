import { Component, Input, OnDestroy, ElementRef, HostBinding } from '@angular/core';
import { MatFormFieldControl } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FocusMonitor } from '@angular/cdk/a11y';
import { VenueService } from 'src/app/venue.service';

class Venue {
  constructor(public building: string, public room: string) { }
}

@Component({
  selector: 'app-venue-input',
  template: `
    <mat-autocomplete #buildingAuto="matAutocomplete">
      <mat-option *ngFor="let building of venues" [value]="building">
        {{ building }}
      </mat-option>
    </mat-autocomplete>
    <div [formGroup]="form">
      <input class="building" formControlName="building" [matAutocomplete]="buildingAuto">
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
  providers: [{ provide: MatFormFieldControl, useExisting: VenueInputComponent }],
})
export class VenueInputComponent implements OnDestroy, MatFormFieldControl<Venue> {
  static nextId = 0;
  @HostBinding('attr.aria-describedby') describedBy = '';

  form: FormGroup;
  venues = this.venueService.venues.map(e => e.buildingCode);

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
    return new Venue(v.building, v.room);
  }
  set value(v) {
    v = v || new Venue('', '');
    this.form.setValue({ building: v.building, room: v.room });
    this.stateChanges.next();
  }

  stateChanges = new Subject<void>();

  @HostBinding() id = `venue-input-${VenueInputComponent.nextId++}`;

  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
  private _placeholder: string;

  ngControl = null;

  focused = false;

  get empty() {
    const n = this.form.value;
    return !n.building && !n.room;
  }

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled(): boolean { return this._disabled; }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.form.disable() : this.form.enable();
    this.stateChanges.next();
  }
  private _disabled = false;

  errorState = false;

  controlType = 'venue-input';

  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }
  onContainerClick(event: MouseEvent): void {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this.elRef.nativeElement.querySelector('input').focus();
    }
  }

  writeValue(): void {
    throw new Error('Method not implemented.');
  }
  registerOnChange(): void {
    throw new Error('Method not implemented.');
  }
  registerOnTouched(): void {
    throw new Error('Method not implemented.');
  }
  setDisabledState?(): void {
    throw new Error('Method not implemented.');
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }
}
