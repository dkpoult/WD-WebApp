import { VenueService } from './../../venue.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-session',
  templateUrl: './edit-session.component.html',
  styleUrls: ['./edit-session.component.scss']
})
export class EditSessionComponent implements OnInit {

  @Input() form: FormGroup;
  @Output() remove = new EventEmitter<void>();

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

}
