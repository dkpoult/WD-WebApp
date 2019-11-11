import {Component, OnInit} from '@angular/core';
import {ScriptableEvent} from '../../shared/services/models';
import {Observable} from 'rxjs';
import {EventService} from '../../shared/services/event.service';
import {map} from 'rxjs/operators';
import {TimetableService} from '../../shared/services/timetable.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  events$: Observable<ScriptableEvent[]> = this.eventService.events$;

  selectedEvent: ScriptableEvent | null;

  constructor(
    private eventService: EventService,
    private timetableService: TimetableService,
  ) {
  }

  ngOnInit() {
    this.eventService.getEvents();
  }

  select(event: ScriptableEvent | null) {
    this.selectedEvent = event;
  }

  selected(event: ScriptableEvent) {
    if (!event || !this.selectedEvent) {
      return false;
    }
    return this.selectedEvent.eventCode === event.eventCode;
  }

}
