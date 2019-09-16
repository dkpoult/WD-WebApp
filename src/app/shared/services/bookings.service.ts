import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API} from './api';
import {UserService} from './user.service';
import {BookableSession} from './models';
import {TimetableService} from './timetable.service';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private timetableService: TimetableService
  ) {
  }

  updateSessions(courseCode: string, newSessions: BookableSession[]) {
    const body = {
      personNumber: this.userService.currentUser.personNumber,
      userToken: this.userService.currentUser.userToken,
      sessions: newSessions,
      courseCode
    };
    return this.http.post(`${API.apiRoot}/course/update_sessions`, body);
  }

  makeBooking(courseCode: string, booking: any) {
    booking.personNumber = this.userService.currentUser.personNumber;
    booking.userToken = this.userService.currentUser.userToken;
    booking.courseCode = courseCode;
    return this.http.post(`${API.apiRoot}/course/make_booking`, booking);
  }
}
