import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VenueNode} from '../../../shared/services/venue.service';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {ScriptableEvent} from '../../../shared/services/models';
import {EventService} from '../../../shared/services/event.service';
import {TimetableService} from '../../../shared/services/timetable.service';

@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.component.html',
  styleUrls: ['./view-event.component.scss']
})
export class ViewEventComponent implements OnInit {

  form: FormGroup;

  @Output() deleted = new EventEmitter<void>();

  constructor(
    private eventService: EventService,
    private timetableService: TimetableService
  ) {
  }

  private _event: ScriptableEvent;

  get event(): ScriptableEvent {
    return this._event;
  }

  @Input() set event(value: ScriptableEvent) {
    if (!value) {
      this._event = null;
      this.form = new FormGroup({
        eventCode: new FormControl('', [Validators.required]),
        eventName: new FormControl('', [Validators.required]),
        eventDescription: new FormControl(''),
        startDate: new FormControl(new Date(), [Validators.required]),
        endDate: new FormControl(new Date(), [Validators.required])
      });
    } else {
      this._event = value;

      this.form = new FormGroup({
        eventCode: new FormControl(value.eventCode),
        eventName: new FormControl(value.eventName, [Validators.required]),
        eventDescription: new FormControl(value.eventDescription),
        startDate: new FormControl(value.startDate, [Validators.required]),
        endDate: new FormControl(value.endDate, [Validators.required])
      });
    }
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  ngOnInit() {
  }

  canSubmit() {
    return this.form.dirty && this.form.valid;
  }

  submit() {
    const event: ScriptableEvent = this.form.value;
    event.startDate = this.timetableService.getDateString(new Date(event.startDate));
    event.endDate = this.timetableService.getDateString(new Date(event.endDate));
    if (this.event) {
      this.eventService.updateEvent(event);
    } else {
      this.eventService.createEvent(event);
    }
    this.form.markAsPristine();
  }

  delete() {
    this.eventService.removeEvent(this.event);
    this.deleted.emit();
  }

}
