import { TimetableService } from './../../shared/timetable.service';
import { VenueService } from './../../venue.service';
import { FormGroup, FormArray } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatChip, MatExpansionPanel } from '@angular/material';

@Component({
  selector: 'app-edit-session',
  templateUrl: './edit-session.component.html',
  styleUrls: ['./edit-session.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EditSessionComponent implements OnInit {

  @Input() form: FormGroup;
  @Output() remove = new EventEmitter<void>();

  @ViewChild('panel') panel: MatExpansionPanel;

  panelOpenState: boolean;

  get cancellations() { return this.form.get('cancellations').value; }

  venues = this.venueService.venues;

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
    for (const c in session.cancellations) {
      if (c < session.cancellations.length) {
        const cancellation = new Date(session.cancellations[c]);
        cancellation.setHours(0);
        if (cancellation.valueOf() === d.valueOf()) {
          return 'cancelled';
        }
      }
    }
    if (this.timetableService.sessionFallsOn(session, d)) {
      return 'fallsOn';
    }
  }

  ngOnInit() {
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

  removeCancellation(i: number) {
    console.log(i);
  }
}
