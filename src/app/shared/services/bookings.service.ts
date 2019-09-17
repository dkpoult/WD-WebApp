import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API} from './api';
import {UserService} from './user.service';
import {BookableSession, Session} from './models';
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
    newSessions.forEach((session: Session) => {
      const date = new Date(session.startDate);
      const dateString: string = this.timetableService.getDateString(date);
      session.startDate = `${dateString} ${session.time}:00`;

      // Don't send useless info
      delete session.time;
    });
    const body = {
      personNumber: this.userService.currentUser.personNumber,
      userToken: this.userService.currentUser.userToken,
      bookableSessions: newSessions,
      courseCode
    };
    console.log(body);
    return this.http.post(`${API.apiRoot}/course/update_bookable_sessions`, body);
  }

  makeBooking(courseCode: string, booking: any) {
    booking.personNumber = this.userService.currentUser.personNumber;
    booking.userToken = this.userService.currentUser.userToken;
    booking.courseCode = courseCode;
    return this.http.post(`${API.apiRoot}/course/make_booking`, booking);
  }
}
