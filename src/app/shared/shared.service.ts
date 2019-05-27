import { SocketService } from './socket.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from './user';
import { map } from 'rxjs/operators';
import { forEach } from '@angular/router/src/utils/collection';
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public apiRoot: string;
  public wsRoot: string;

  // tslint:disable-next-line: variable-name
  private _currentUser: User;
  public get currentUser() {
    return this.getLoggedInUser();
  }
  public set currentUser(value) {
    this._currentUser = value;
  }
  public localStorage: any = window.localStorage;

  public isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private socketService: SocketService,
    private http: HttpClient,
  ) { }

  // Gets called from app.module when the system starts up
  initialise(): void {
    this.apiRoot = 'https://wd.dimensionalapps.com';
    this.wsRoot = 'wss://wd.dimensionalapps.com';
    this.currentUser = this.getLoggedInUser();
    if (this.isLoggedIn()) {
      this.connnectToChatSocket();
    }
    this.http.get<any>(`./assets/apiUrl.json`).subscribe((response) => { this.apiRoot = response.api; }); // ! Should use this but who cares
  }

  connnectToChatSocket() {
    this.socketService.connect(this.wsRoot, this.currentUser);
  }

  // Authentication
  linkUser(user: User): Observable<any> {
    return this.http.post(`${this.apiRoot}/auth/register`, user);
  }

  authenticateUser(user: User): Observable<any> {
    return this.http.post(`${this.apiRoot}/auth/login`, user);
  }

  // Venues
  getVenues(): Observable<any> {
    return this.http.post(`${this.apiRoot}/venue/get_venues`, this.currentUser);
  }

  addDummyVenue(): Observable<any> {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken,
      venue: {
        buildingCode: 'FNB',
        subCode: 'building',
        coordinates: '0.000,0.000'
      }
    };
    return this.http.post(`${this.apiRoot}/venue/add_venue`, body);
  }

  // Courses
  getCourses(): Observable<any> {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken
    };
    return this.http.post(`${this.apiRoot}/course/get_courses`, body);
  }

  getCourse(courseCode: string): Observable<any> {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken,
      courseCode
    };
    return this.http.post(`${this.apiRoot}/course/get_course`, body)
      .pipe(map((result: any) => {
        switch (result.responseCode) {
          case 'successful':
            return { responseCode: result.responseCode, course: result.courses[0] }; // POST responds with array of single course
          default:
            console.log(result);
            return result;
        }
      }));
  }

  getAvailableCourses(): Observable<any> {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken
    };
    return this.http.post(`${this.apiRoot}/course/get_available_courses`, body);
  }

  enrolInCourse(courseCode, password?: string): Observable<any> {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken,
      courseCode,
      password
    };
    return this.http.post(`${this.apiRoot}/course/enrol_in_course`, body);
  }

  createCourse(course: any): Observable<any> {
    const body = {
      courseCode: course.code,
      courseName: course.name,
      courseDescription: course.description ? course.description : '',
      password: course.password ? course.password : null,
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken,
    };
    return this.http.post(`${this.apiRoot}/course/create_course`, body);
  }

  updateCourse(newInfo: any): Observable<any> {
    newInfo.sessions.forEach((session: any) => {
      const date = new Date(session.date);
      const year = date.getFullYear().toString();
      let month = (date.getMonth() + 1).toString(); // Month is 0 based for whatever reason
      if (month.length < 2) {
        month = '0' + month;
      }
      let day = date.getDate().toString();
      if (day.length < 2) {
        day = '0' + day;
      }
      session.nextDate = `${year}-${month}-${day} ${session.time}:00`;

      // Don't send useless info
      delete session.date;
      delete session.time;
    });
    const body = {
      courseCode: newInfo.courseCode,
      courseName: newInfo.name,
      courseDescription: newInfo.description,
      sessions: newInfo.sessions,
      password: newInfo.clearKey ? '' : newInfo.password,
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken
    };
    return this.http.post(`${this.apiRoot}/course/update_course`, body);
  }

  updateSessions(courseCode: string, newSessions: Array<any>): Observable<any> {
    newSessions.forEach((session: any) => {
      const date = new Date(session.date);
      const year = date.getFullYear().toString();
      // Month is 0 based for whatever reason
      let month = (date.getMonth() + 1).toString();
      if (month.length < 2) {
        month = '0' + month;
      }
      let day = date.getDate().toString();
      if (day.length < 2) {
        day = '0' + day;
      }
      session.nextDate = `${year}-${month}-${day} ${session.time}:00`;

      // Don't send useless info
      delete session.date;
      delete session.time;
    });
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken,
      sessions: newSessions,
      courseCode
    };
    return this.http.post(`${this.apiRoot}/course/update_sessions`, body);
  }

  linkCourse(courseId): Observable<any> {
    const body = {
      courseId,
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken
    };
    return this.http.post(`${this.apiRoot}/course/link_course`, body);
  }

  // Forum
  getPosts(forum: string): Observable<any> {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken,
      forumCode: forum
    };
    return this.http.post(`${this.apiRoot}/forum/get_posts`, body);
  }

  getPost(post: string): Observable<any> {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken,
      postCode: post
    };
    return this.http.post(`${this.apiRoot}/forum/get_post`, body)
      .pipe(map((result: any) => {
        return { responseCode: result.responseCode, post: result.posts[0] }; // POST responds with array of single post
      }));
  }

  makePost(post: any): Observable<any> {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken,
      forumCode: post.forum,
      title: post.title,
      body: post.body
    };
    return this.http.post(`${this.apiRoot}/forum/make_post`, body);
  }

  makeComment(post: any, comment: string): Observable<any> {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken,
      postCode: post.code,
      body: comment
    };
    return this.http.post(`${this.apiRoot}/forum/make_comment`, body);
  }

  markAsAnswer(postCode: string, commentCode: string): Observable<any> {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken,
      postCode,
      commentCode
    };
    return this.http.post(`${this.apiRoot}/forum/set_answer`, body);
  }

  vote(post: any, vote: number): Observable<any> {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken,
      postCode: post.code,
      vote
    };
    return this.http.post(`${this.apiRoot}/forum/make_vote`, body);
  }

  // Push
  makeAnnouncement(courseCode: string, announcement: any): Observable<any> {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken,
      body: announcement.body,
      title: announcement.title,
      courseCode,
    };
    return this.http.post(`${this.apiRoot}/push/make_announcement`, body);
  }

  // Survey
  makeDummySurvey(courseCode: string): Observable<any> {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken,
      title: 'Test Question',
      options: ['It works', 'It doesn\'t work'],
      responseType: 'MC',
      courseCode
    };
    return this.http.post(`${this.apiRoot}/survey/make_survey`, body);
  }

  makeSurvey(courseCode: string, survey: any) {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken,
      title: survey.title,
      options: survey.options,
      responseType: survey.responseType,
      courseCode
    };
    return this.http.post(`${this.apiRoot}/survey/make_survey`, body);
  }

  closeSurvey(courseCode: string): Observable<any> {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken,
      courseCode
    };
    return this.http.post(`${this.apiRoot}/survey/close_survey`, body);
  }

  getSurvey(courseCode: string, getResults = false): Observable<any> {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken,
      courseCode
    };
    if (getResults) {
      return this.http.post(`${this.apiRoot}/survey/get_results`, body);
    } else {
      return this.http.post(`${this.apiRoot}/survey/get_survey`, body);
    }
  }

  answerSurvey(courseCode, answer: string | number): Observable<any> {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken,
      courseCode,
      answer
    };
    return this.http.post(`${this.apiRoot}/survey/send_answer`, body);
  }

  // util
  updatePreferences(field: string, value: any) {
    const user = this.currentUser;
    user.preferences[field] = value;
    this.http.post(`${this.apiRoot}/auth/save_preferences`, user).subscribe((result: any) => {
      console.log(result);
      switch (result.responseCode) {
        case 'successful':
          this.localStorage.setItem(`user`, JSON.stringify(user));
          break;
      }
    });
  }

  isLoggedIn(): boolean {
    const user = this.localStorage.getItem('user');
    return !!user;
  }

  getLoggedInUser(): User {
    return JSON.parse(this.localStorage.getItem('user'));
  }

  loginUser(personNumber: string, userToken: string, preferences: any) {
    this.localStorage.setItem('user', JSON.stringify(new User(personNumber, userToken, preferences)));
    this.currentUser = this.getLoggedInUser();
    this.connnectToChatSocket();
    console.log(`Logged in user ${personNumber} with token ${userToken}`);
  }

  signOut() {
    // TODO: Confirm dialog
    this.localStorage.removeItem('user');
    this.currentUser = null;
  }
}
