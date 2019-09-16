import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API} from './api';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {
  }

  updateSessions() {
  }

  makeBooking(courseCode: string, booking: any) {
    booking.personNumber = this.userService.currentUser.personNumber;
    booking.userToken = this.userService.currentUser.userToken;
    booking.courseCode = courseCode;
    return this.http.post(`${API.apiRoot}/course/make_booking`, booking);
  }
}
