import { TimetableService } from './../../shared/timetable.service';
import { VenueService } from './../../venue.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { MatChip, MatExpansionPanel, MatDatepicker } from '@angular/material';

@Component({
  selector: 'app-edit-session',
  templateUrl: './edit-session.component.html',
  styleUrls: ['./edit-session.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EditSessionComponent implements OnInit {

  @Input() form: FormGroup;
  @Output() remove = new EventEmitter<void>();

  @ViewChild('cancelDatePicker') cancelDatePicker;
  @ViewChild('panel') panel: MatExpansionPanel;

  panelOpenState: boolean;

  get cancellations(): Array<string> { return this.form.get('cancellations').value; }
  set cancellations(v: Array<string>) { this.form.get('cancellations').setValue(v); }

  get startDate() { return this.form.get('date').value; }
  set startDate(v) { this.form.get('date').setValue(v); }

  venues;

  repeatTypes = [
    { value: 'ONCE', text: 'Never' },
    { value: 'DAILY', text: 'Daily' },
    { value: 'WEEKLY', text: 'Weekly' },
    { value: 'MONTHLY', text: 'Monthly' },
  ];
  sessionTypes = [
    { value: 'LECTURE', text: 'Lecture' },
    { value: 'LAB', text: 'Lab' },
    { value: 'TUTORIAL', text: 'Tutorial' },
    { value: 'TEST', text: 'Test' },
    { value: 'OTHER', text: 'Other' },
  ];
  constructor(private venueService: VenueService, private timetableService: TimetableService) { }

  dateClass = (d: Date) => {
    const session = this.form.value;
    if (!session.date) {
      session.date = session.nextDate;
    }
    const classStrings = [];

    for (const c in session.cancellations) {
      if (c < session.cancellations.length) {
        const cancellation = new Date(session.cancellations[c]);
        cancellation.setHours(0);
        if (cancellation.valueOf() === d.valueOf()) {
          classStrings.push('cancelled');
        }
      }
    }

    if (this.timetableService.sessionFallsOn(session, d)) {
      classStrings.push('fallsOn');
    }

    if (this.timetableService.inPast(session, d)) {
      classStrings.push('inPast');
    }

    return classStrings.join(' ');
  }

  ngOnInit() {
    setTimeout(() => {
      this.venues = this.venueService.venues.map(e => e.buildingCode);
    }, 500);
  }

  removeSession() {
    this.remove.emit();
  }

  getPeriod(type: string, num: number) {
    let period;
    switch (type) {
      case 'DAILY':
        period = 'day';
        break;
      case 'WEEKLY':
        period = 'week';
        break;
      case 'MONTHLY':
        period = 'month';
        break;
    }
    return period + (num > 1 ? 's' : '');
  }

  log(message) {
    console.log(message);
  }

  selectChip(chip: MatChip) {
    this.form.controls.sessionType.setValue(chip.value);
    this.form.markAsDirty();
  }

  titleCase(text) {
    return text.toLowerCase()
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ');
  }

  toggleDisabled() {
    const state = !this.panel.disabled;
    if (!state) {
      this.panel.close();
    }
    this.panel.disabled = state;
    this.form.setErrors({ required: state });
    if (state) {
      this.form.markAsDirty();
    }
  }

  removeCancellation(index: number) {
    this.cancellations = this.cancellations.filter((v, i) => {
      return i !== index;
    });
    this.form.markAsDirty();
  }

  addCancellation(date) {
    this.cancelDatePicker._selected = null;
    const year = date.getFullYear().toString();
    let month = (date.getMonth() + 1).toString(); // Month is 0 based for whatever reason
    if (month.length < 2) {
      month = '0' + month;
    }
    let day = date.getDate().toString();
    if (day.length < 2) {
      day = '0' + day;
    }
    const cancellation = `${year}-${month}-${day}`;
    if (this.cancellations.includes(cancellation)) {
      return;
    }
    this.cancellations.push(cancellation);
    this.form.markAsDirty();
  }
}
