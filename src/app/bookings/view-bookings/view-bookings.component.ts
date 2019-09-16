import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatSnackBar} from '@angular/material';
import {TimetableService} from '../../shared/services/timetable.service';
import {BookableSession, Course} from '../../shared/services/models';
import {UserService} from '../../shared/services/user.service';

@Component({
  selector: 'app-view-bookings',
  templateUrl: './view-bookings.component.html',
  styleUrls: ['./view-bookings.component.scss'],
  animations: [
    trigger(
      'slideInOut',
      [
        transition(
          ':enter',
          [
            style({
              transform: 'translateX(-1000px)',
              opacity: 0,
              'box-shadow': '0 0 0 0 transparent'
            }),
            animate('.3s ease-out',
              style({
                transform: 'translateX(0px)',
                opacity: 1,
                'box-shadow': '*'
              }))
          ]
        ),
        transition(
          ':leave',
          [
            style({
              transform: 'translateX(0)',
              opacity: 1,
              'box-shadow': '*'
            }),
            animate('.3s ease-in',
              style({
                transform: 'translateX(-1000px)',
                opacity: 0,
                'box-shadow': '0 0 0 0 transparent'
              }))
          ]
        ),
      ]
    ),
    trigger(
      'fadeIn',
      [
        state('hidden', style({opacity: 0, display: 'none'})),
        state('shown', style({opacity: 1, display: '*'})),
        transition(
          'hidden => shown',
          animate('.3s ease-in-out')
        )
      ],
    ),
  ]
})
export class ViewBookingsComponent implements OnInit {

  @Output() update = new EventEmitter();
  @Input() course: Course;

  form: FormGroup;

  constructor(
    private snackBar: MatSnackBar,
    private timetableService: TimetableService,
    private userService: UserService
  ) {
  }

  get formSessions() {
    return (this.form.get('sessions') as FormArray);
  }

  get sessionCount() {
    return !!this.formSessions ? this.formSessions.length : 0;
  }

  ngOnInit() {
    this.form = new FormGroup({});
    const sessions: FormGroup[] = [];
    const personNumber = this.userService.currentUser.personNumber;
    for (const s in this.course.bookableSessions[personNumber]) {
      if (!this.course.bookableSessions[personNumber].hasOwnProperty(s)) {
        continue;
      }
      const session = this.course.bookableSessions[personNumber][s];
      const date = new Date(session.startDate);
      let dateStr: string;
      let timeStr: string;
      let endStr: string;
      if (date.toString() === 'Invalid Date') {
        dateStr = '';
        timeStr = '';
        endStr = '';
      } else {
        dateStr = date.toISOString();
        timeStr = date.toTimeString().substr(0, 5);
        console.log(timeStr);
        endStr = this.timetableService.getTimeString(date, session.duration);
      }
      if (!session.venue) {
        session.venue = {buildingCode: '', subCode: '', coordinates: null};
      }
      if (!session.cancellations) {
        session.cancellations = [];
      }
      session.cancellations.forEach(cancel => {
        cancel = new Date(cancel);
      });
      const newSession = new FormGroup({
        venue: new FormGroup({
          buildingCode: new FormControl(session.venue.buildingCode, [Validators.required]),
          subCode: new FormControl(session.venue.subCode, [Validators.required]),
        }),
        repeatType: new FormControl(session.repeatType, [Validators.required]),
        repeatGap: new FormControl(session.repeatGap, [Validators.required]),
        sessionType: new FormControl(session.sessionType, [Validators.required]),
        startDate: new FormControl(dateStr, [Validators.required]),
        time: new FormControl(timeStr, [Validators.required]),
        endTime: new FormControl(endStr, [Validators.required]),
        slotGap: new FormControl(session.slotGap, [Validators.required]),
        slotCount: new FormControl(session.slotCount, [Validators.required]),
        cancellations: new FormControl(session.cancellations),
        delete: new FormControl(false)
      });
      sessions.push(newSession);
    }
    this.form.addControl('sessions', new FormArray(sessions));
  }

  addSession() {
    const newSession = new FormGroup({
      venue: new FormGroup({
        buildingCode: new FormControl('', [Validators.required]),
        subCode: new FormControl('', [Validators.required]),
      }),
      repeatType: new FormControl('WEEKLY', [Validators.required]),
      repeatGap: new FormControl(1, [Validators.required, Validators.min(1)]),
      sessionType: new FormControl('CONSULTATION', [Validators.required]),
      startDate: new FormControl(new Date(), [Validators.required]),
      time: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required]),
      slotCount: new FormControl(1, [Validators.required]),
      slotGap: new FormControl(0, [Validators.required]),
      cancellations: new FormControl([]),
    });
    console.log(newSession.value);
    this.formSessions.controls.push(newSession);
    console.log(this.formSessions.value);
  }

  removeSession(i: number) {
    this.form.markAsDirty();
    const removed = this.formSessions.at(i);
    const snackBarRef = this.snackBar.open('Removed bookable session', 'Undo', {duration: 2000});
    snackBarRef.onAction().subscribe(() => {
      this.formSessions.insert(i, removed);
    });
    this.formSessions.removeAt(i);
  }

  submit() {
    const newSessions = this.form.value.sessions;
    newSessions.forEach((session: any) => {
      console.log(session);
      session.duration = this.timetableService.timeBetween(session.time, session.endTime);
      delete session.endTime;
      const date = new Date(session.startDate);
      const dateString: string = this.timetableService.getDateString(date);
      session.startDate = `${dateString} ${session.time}:00`;

      // Don't send useless info
      delete session.time;
    });
    console.log(newSessions);
    this.update.next(newSessions);
    this.form.markAsPristine();
  }

  isValid() {
    let invalid = false;
    if (!!this.formSessions) {
      this.formSessions.controls.forEach(control => {
        if (control.invalid) {
          invalid = true;
          return;
        }
      });
    }
    return !invalid;
  }

  isDirty() {
    let dirty = false;
    if (!!this.formSessions) {
      this.formSessions.controls.forEach(control => {
        if (control.dirty) {
          dirty = true;
          return;
        }
      });
    }
    return this.form.dirty || dirty;
  }

  hasErrors(): boolean {
    // ! TODO: Fix form array invalid when all controls are valid (Same as update-sessions)
    return (
      !this.isValid() ||
      !this.isDirty()
    );
  }
}
