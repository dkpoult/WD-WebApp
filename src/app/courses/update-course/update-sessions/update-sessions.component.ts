import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {TimetableService} from '../../../shared/services/timetable.service';

@Component({
  selector: 'app-update-sessions',
  templateUrl: './update-sessions.component.html',
  styleUrls: ['./update-sessions.component.scss'],
  animations: [
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
        )
      ]
    ),
  ]
})
export class UpdateSessionsComponent implements OnInit {

  form: FormGroup;
  @Input() sessions: any = {};
  @Output() submitSessions = new EventEmitter<any>();

  constructor(
    private snackBar: MatSnackBar,
    private timetableService: TimetableService
  ) {
  }

  get formSessions() {
    return (this.form.get('sessions') as FormArray);
  }

  get sessionCount() {
    return this.formSessions.length;
  }

  ngOnInit() {
    this.form = new FormGroup({});
    const sessions: FormGroup[] = [];
    this.sessions.forEach(session => {
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
        endStr = this.timetableService.getTimeString(date, session.duration);
      }
      if (!session.venue) {
        session.venue = {building: null, room: null};
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
        cancellations: new FormControl(session.cancellations),
        delete: new FormControl(false)
      });
      sessions.push(newSession);
    });
    this.form.addControl('sessions', new FormArray(sessions));
  }

  addSession() {
    const newSession = new FormGroup({
      venue: new FormGroup({
        buildingCode: new FormControl('', [Validators.required]),
        subCode: new FormControl('', [Validators.required]),
      }),
      repeatType: new FormControl('WEEKLY', [Validators.required]),
      repeatGap: new FormControl('1', [Validators.required, Validators.min(1)]),
      sessionType: new FormControl('LECTURE', [Validators.required]),
      startDate: new FormControl(new Date(), [Validators.required]),
      time: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required]),
      cancellations: new FormControl([]),
    });
    this.formSessions.controls.push(newSession);
  }

  removeSession(i: number) {
    this.form.markAsDirty();
    const removed = this.formSessions.at(i);
    const snackBarRef = this.snackBar.open('Removed session', 'Undo', {duration: 2000});
    snackBarRef.onAction().subscribe(() => {
      this.formSessions.insert(i, removed);
    });
    this.formSessions.removeAt(i);
  }

  log(item: any) {
    console.log(item);
  }

  findInvalidControls(_input: AbstractControl, _invalidControls: AbstractControl[]): AbstractControl[] {
    if (!_invalidControls) {
      _invalidControls = [];
    }
    if (_input instanceof FormControl) {
      if (_input.invalid) {
        _invalidControls.push(_input);
      }
      return _invalidControls;
    }

    if (!(_input instanceof FormArray) && !(_input instanceof FormGroup)) {
      return _invalidControls;
    }

    const controls = _input.controls;
    // tslint:disable-next-line: forin
    for (const name in controls) {
      const control = controls[name];
      if (control.invalid) {
        _invalidControls.push(control);
      }
      switch (control.constructor.name) {
        case 'FormArray':
          (control as FormArray).controls.forEach(_control => _invalidControls = this.findInvalidControls(_control, _invalidControls));
          break;

        case 'FormGroup':
          _invalidControls = this.findInvalidControls(control, _invalidControls);
          break;
      }
    }

    return _invalidControls;
  }

  isValid() {
    let invalid = false;
    this.formSessions.controls.forEach(control => {
      if (control.invalid) {
        invalid = true;
        return;
      }
    });
    return !invalid;
  }

  isDirty() {
    let dirty = false;
    this.formSessions.controls.forEach(control => {
      if (control.dirty) {
        dirty = true;
        return;
      }
    });
    return this.form.dirty || dirty;
  }

  canSubmit(): boolean {
    // ! TODO: Fix form array invalid when all controls are valid
    // return (
    //   this.form.valid &&
    //   this.form.dirty
    // );
    return (
      this.isValid() &&
      this.isDirty()
    );
  }

  submit() {
    const newSessions = this.form.value.sessions;
    newSessions.forEach((session: any) => {
      session.duration = this.timetableService.timeBetween(session.time, session.endTime);
      delete session.endTime;
    });
    console.log(newSessions);
    this.submitSessions.next(newSessions);
    this.form.markAsPristine();
  }
}
