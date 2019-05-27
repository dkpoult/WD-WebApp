import { VenueService } from './../../venue.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatChip } from '@angular/material';
import { formArrayNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';

@Component({
  selector: 'app-edit-session',
  templateUrl: './edit-session.component.html',
  styleUrls: ['./edit-session.component.scss']
})
export class EditSessionComponent implements OnInit {

  @Input() form: FormGroup;
  @Output() remove = new EventEmitter<void>();

  panelOpenState: boolean;

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
  constructor(private venueService: VenueService) { }

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
}
