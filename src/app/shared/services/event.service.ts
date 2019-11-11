import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { API } from './api';
import { ScriptableEvent } from './models';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  user = this.userService.currentUser;
  private eventSubject = new Subject<ScriptableEvent[]>();
  public events$ = this.eventSubject.asObservable();

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {
  }

  private _events: ScriptableEvent[];

  get events() {
    return this._events;
  }

  set events(events: ScriptableEvent[]) {
    this._events = events;
    this.eventSubject.next(events);
  }

  getEvents() {
    const req = this.http.post(`${API.apiRoot}/event/get_events`, {});
    req.subscribe((result: any) => {
      switch (result.responseCode) {
        case 'successful':
          this.events = result.events;
          break;
        default:
          console.log(result);
      }
    });
    return req;
  }

  createEvent(event: ScriptableEvent) {
    const { eventCode, eventName, eventDescription, startDate, endDate, stages } = event;
    const { personNumber, userToken } = this.user;
    const body = {
      eventCode,
      eventName,
      eventDescription,
      startDate,
      endDate,
      stages,
      personNumber,
      userToken
    };

    const req = this.http.post(`${API.apiRoot}/event/make_event`, body);
    req.subscribe(() => this.getEvents()); // When it finishes, get the events again
    return req;
  }

  removeEvent(event: ScriptableEvent) {
    const { eventCode } = event;
    const { personNumber, userToken } = this.user;
    const body = { eventCode, personNumber, userToken };

    const req = this.http.post(`${API.apiRoot}/event/remove_event`, body);
    req.subscribe(() => this.getEvents());
    return req;
  }

  updateEvent(event: ScriptableEvent) {
    const { eventCode, eventName, eventDescription, startDate, endDate, stages } = event;
    const { personNumber, userToken } = this.user;
    const body = {
      eventCode,
      eventName,
      eventDescription,
      startDate,
      endDate,
      stages,
      personNumber,
      userToken
    };

    const req = this.http.post(`${API.apiRoot}/event/update_event`, body);
    req.subscribe(() => this.getEvents());
    return req;
  }

}
