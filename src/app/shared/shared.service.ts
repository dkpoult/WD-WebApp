import { Injectable, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { User } from './user';
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public apiRoot: string;

  public localStorage: any = window.localStorage;

  constructor(private http: HttpClient, private logger: NGXLogger) { }

  // Gets called from app.module when the system starts up
  initialise(): void {
    this.apiRoot = 'https://wd.dimensionalapps.com'; // TODO: Hack, rather make everything wait for initialisation first
    this.http.get<any>(`./assets/apiUrl.json`).subscribe((response) => { this.apiRoot = response.api; });
  }

  linkUser(user: User): Observable<any> {
    return this.http.post(`${this.apiRoot}/register`, user);
  }

  authenticateUser(user: User): Observable<any> {
    return this.http.post(`${this.apiRoot}/login`, user);
  }

  getCourses(user: User): Observable<any> {
    let body = {
      personNumber: user.personNumber,
      userToken: user.token
    };
    return this.http.post(`${this.apiRoot}/get_courses`, body);
  }

  createCourse(course: any): Observable<any> {
    let user = this.getLoggedInUser();
    let body = {
      courseCode: course.code,
      courseName: course.name,
      courseDescription: course.description ? course.description : '',
      personNumber: user.personNumber,
      userToken: user.token
    };
    return this.http.post(`${this.apiRoot}/create_course`, body);
  }

  linkCourse(course: any): Observable<any> {
    let user = this.getLoggedInUser();
    let body = {
      courseId: course.id,
      personNumber: user.personNumber,
      userToken: user.token
    };
    return this.http.post(`${this.apiRoot}/link_course`, body);
  }

  isLoggedIn(): boolean {
    const user = this.localStorage.getItem('user');
    if (!user) {
      return false;
    }
    return true;
  }

  getLoggedInUser() {
    return JSON.parse(this.localStorage.getItem('user'));
  }

  loginUser(personNumber: string, token: string) {
    this.localStorage.setItem('user', JSON.stringify(new User(personNumber, token)));
    this.logger.debug(`Logged in user ${personNumber} with token ${token}`);
  }

  userIsValid(): any {
    return this.isLoggedIn();
  }

  signOut() {
    // TODO: Confirm dialog
    this.localStorage.removeItem('user');
  }
}
