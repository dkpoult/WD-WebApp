import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BookableSession, Course} from '../../shared/services/models';
import {TimetableService} from '../../shared/services/timetable.service';

interface Slot {
  startTime: string;
  endTime: string;
  taken: boolean;
  slotIndex: number;
  repeatIndex: number;
  sessionId: number;
}

@Component({
  selector: 'app-make-booking',
  templateUrl: './make-booking.component.html',
  styleUrls: ['./make-booking.component.scss']
})
export class MakeBookingComponent implements OnInit {

  @Output() book = new EventEmitter();

  @Input() course: Course;
  form: FormGroup;
  sessions: BookableSession[] = [];
  slots = [];
  selectedDate: Date = null;

  constructor(
    private timetableService: TimetableService,
  ) {
  }

  get lecturer() {
    return this.form.value.lecturerPersonNumber;
  }

  ngOnInit() {
    this.form = new FormGroup({
      lecturerPersonNumber: new FormControl('', Validators.required),
      slot: new FormControl(null, Validators.required)
    });
  }

  selectDate(date: Date) {
    // For every bookableSession for the selected lecturer
    this.sessions = [];
    for (const session of this.course.bookableSessions[this.lecturer]) {
      const startDate = new Date(session.startDate);
      if (this.timetableService.sessionFallsOn(session, date)) {
        this.sessions.push(session);
      }
    }
    this.selectedDate = date;
    // update slots
    const slots = [];
    for (const session of this.sessions) {
        for (let s = 0; s < session.slotCount; s++) { // This is not the right loop, there should be _another_ above it
          const repeats = this.timetableService.repeatsSince(new Date(session.startDate), date, session.repeatType, session.repeatGap);
          const b = repeats.toString(10);
          const booking = session.bookings[b] ?
                          session.bookings[b][s] : null;
          if (this.getSlotDuration(session) > 0) {
            slots.push({
              startTime: this.getSlotStartTime(session, s),
              endTime: this.getSlotEndTime(session, s),
              taken: !!booking && booking.allocated,
              sessionId: session.id,
              slotIndex: s,
              repeatIndex: repeats
            });
          }
        }
    }
    this.slots = slots;
    this.form.controls.slot.setValue(null);
  }

  hasErrors() {
    return this.form.pristine || this.form.invalid;
  }

  submit() {
    const v = this.form.value;
    const value = {
      lecturerPersonNumber: v.lecturerPersonNumber,
      bookableSessionId: v.slot.sessionId,
      repeatIndex: v.slot.repeatIndex,
      slotIndex: v.slot.slotIndex
    };
    this.book.emit(value);
    this.form.markAsPristine();
  }

  getSlotStartTime(session, i: number) {
    const duration = session.duration / session.slotCount;
    const time = new Date(session.startDate).getTime();
    const t = new Date(time + duration * this.timetableService.minutesToMillis * i);
    const hours = t.getHours();
    const minutes = t.getMinutes();
    return `${hours.toString(10).padStart(2, '0')}:${minutes.toString(10).padStart(2, '0')}`;
  }

  getSlotEndTime(session, i: number) {
    const duration = session.duration / session.slotCount;
    const time = new Date(session.startDate).getTime();
    const t = new Date(time
      + duration * this.timetableService.minutesToMillis * (i + 1)
      - session.slotGap * this.timetableService.minutesToMillis);
    const hours = t.getHours();
    const minutes = t.getMinutes();
    return `${hours.toString(10).padStart(2, '0')}:${minutes.toString(10).padStart(2, '0')}`;
  }

  getSlotDuration(session) {
    return (session.duration / session.slotCount) * this.timetableService.minutesToMillis
      - session.slotGap * this.timetableService.minutesToMillis;
  }
}
