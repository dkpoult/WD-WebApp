import {FormGroup} from '@angular/forms';
import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatChip, MatExpansionPanel} from '@angular/material';
import {VenueService} from 'src/app/shared/services/venue.service';
import {TimetableService} from 'src/app/shared/services/timetable.service';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-session-form',
  templateUrl: './session-form.component.html',
  styleUrls: ['./session-form.component.scss'],
  animations: [
    trigger(
      'fade',
      [
        transition(
          ':enter',
          [
            style({opacity: 0}),
            animate('.3s ease-out',
              style({opacity: 1}))
          ]
        ),
        transition(
          ':leave',
          [
            style({opacity: 1}),
            animate('.3s ease-in',
              style({opacity: 0}))
          ]
        )
      ]
    ),
    trigger(
      'growInOut',
      [
        transition(
          ':enter',
          [
            style({transform: 'scale(0)'}),
            animate('.3s ease-out',
              style({transform: 'scale(1)'}))
          ]
        ),
        transition(
          ':leave',
          [
            style({transform: 'scale(1)'}),
            animate('.3s ease-in',
              style({transform: 'scale(0)'}))
          ]
        )
      ],
    ),
  ]
})
export class SessionFormComponent implements OnInit {

  @Input() form: FormGroup;
  @Output() remove = new EventEmitter<void>();

  @ViewChild('cancelDatePicker') cancelDatePicker;
  @ViewChild('panel') panel: MatExpansionPanel;

  panelOpenState: boolean;
  venues;
  repeatTypes = [
    {value: 'ONCE', text: 'Once only'},
    {value: 'DAILY', text: 'Daily'},
    {value: 'WEEKLY', text: 'Weekly'},
    {value: 'MONTHLY', text: 'Monthly'},
  ];
  sessionTypes = [
    {value: 'LECTURE', text: 'Lecture'},
    {value: 'LAB', text: 'Lab'},
    {value: 'TUTORIAL', text: 'Tutorial'},
    {value: 'TEST', text: 'Test'},
    {value: 'OTHER', text: 'Other'},
  ];

  constructor(private venueService: VenueService, private timetableService: TimetableService) {
  }

  get cancellations(): string[] {
    return this.form.get('cancellations').value;
  }

  set cancellations(v: string[]) {
    this.form.get('cancellations').setValue(v);
  }

  get startDate() {
    return this.form.get('date').value;
  }

  set startDate(v) {
    this.form.get('date').setValue(v);
  }

  dateClass = (d: Date) => {
    const session = this.form.value;
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
  };

  ngOnInit() {
    this.venues = [];
    this.venueService.newVenues$.subscribe((venues: any) => {
      this.venues = venues.map(e => e.buildingCode);
    });
    this.venueService.refreshVenues();
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
    this.form.setErrors({required: state});
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
    const dateString: string = this.timetableService.getDateString(date);
    const cancellation = `${dateString}`;
    if (this.cancellations.includes(cancellation)) {
      this.cancellations = this.cancellations.filter(v => v !== cancellation);
      return;
    }
    this.cancellations.push(cancellation);
    this.form.markAsDirty();
  }
}
