import {API} from './api';
import {PermissionService} from './permission.service';
import {ThemeService} from './theme.service';
import {SocketService} from './socket.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Session, User} from './models';
import {map} from 'rxjs/operators';
import {UserService} from './user.service';
import {TimetableService} from './timetable.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public localStorage: any = window.localStorage;

  public isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private socketService: SocketService,
    private permissionService: PermissionService,
    private themeService: ThemeService,
    private userService: UserService,
    private timetableService: TimetableService,
    private http: HttpClient,
  ) {
  }

  private get currentUser() {
    return this.userService.currentUser;
  }

  // Gets called from app.module when the system starts up
  initialise(): void {
    this.permissionService.updateLookups();
  }

  // Authentication
  linkUser(user: User): Observable<any> {
    return this.http.post(`${API.apiRoot}/auth/register`, user);
  }

  authenticateUser(user: User): Observable<any> {
    return this.http.post(`${API.apiRoot}/auth/login`, user);
  }

  // Venues
  getVenues(): Observable<any> {
    return this.http.post(`${API.apiRoot}/venue/get_venues`, this.currentUser);
  }

  // Courses
  getCourses(): Observable<any> {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken
    };
    return this.http.post(`${API.apiRoot}/course/get_courses`, body);
  }

  getCourse(courseCode: string): Observable<any> {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken,
      courseCode
    };
    return this.http.post(`${API.apiRoot}/course/get_course`, body)
      .pipe(map((result: any) => {
        switch (result.responseCode) {
          case 'successful':
            return {responseCode: result.responseCode, course: result.courses[0]}; // POST responds with array of single course
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
    return this.http.post(`${API.apiRoot}/course/get_available_courses`, body);
  }

  enrolInCourse(courseCode, password?: string): Observable<any> {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken,
      courseCode,
      password
    };
    return this.http.post(`${API.apiRoot}/course/enrol_in_course`, body);
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
    return this.http.post(`${API.apiRoot}/course/create_course`, body);
  }

  updateCourseDetails(courseCode: string, details: any) {
    const body = details;
    body.courseCode = courseCode;
    body.personNumber = this.currentUser.personNumber;
    body.userToken = this.currentUser.userToken;
    return this.http.post(`${API.apiRoot}/course/update_course`, body);
  }

  updateSessions(courseCode: string, newSessions: Session[]): Observable<any> {
    newSessions.forEach((session: any) => {
      const date = new Date(session.date);
      const dateString: string = this.timetableService.getDateString(date);
      session.startDate = `${dateString} ${session.time}:00`;

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
    return this.http.post(`${API.apiRoot}/course/update_sessions`, body);
  }

  linkCourse(courseId): Observable<any> {
    const body = {
      courseId,
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken
    };
    return this.http.post(`${API.apiRoot}/course/link_course`, body);
  }

  syncWithMoodle(courseCode: string): Observable<any> {
    const body = {
      courseCode,
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken
    };
    return this.http.post(`${API.apiRoot}/course/resync_course`, body);
  }

  // Chat
  getMessages(courseCode: string, tutor: boolean = false) {
    const body = {
      chatroomCode: `${courseCode}:${tutor ? 'tutor' : 'normal'}`,
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken
    };
    return this.http.post(`${API.apiRoot}/chat/get_messages`, body);
  }

  // Forum
  getPosts(forum: string): Observable<any> {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken,
      forumCode: forum
    };
    return this.http.post(`${API.apiRoot}/forum/get_posts`, body);
  }

  getPost(post: string): Observable<any> {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken,
      postCode: post
    };
    return this.http.post(`${API.apiRoot}/forum/get_post`, body)
      .pipe(map((result: any) => {
        return {responseCode: result.responseCode, post: result.posts[0]}; // POST responds with array of single post
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
    return this.http.post(`${API.apiRoot}/forum/make_post`, body);
  }

  makeComment(post: any, comment: string): Observable<any> {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken,
      postCode: post.code,
      body: comment
    };
    return this.http.post(`${API.apiRoot}/forum/make_comment`, body);
  }

  markAsAnswer(postCode: string, commentCode: string): Observable<any> {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken,
      postCode,
      commentCode
    };
    return this.http.post(`${API.apiRoot}/forum/set_answer`, body);
  }

  vote(post: any, vote: number): Observable<any> {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken,
      postCode: post.code,
      vote
    };
    return this.http.post(`${API.apiRoot}/forum/make_vote`, body);
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
    return this.http.post(`${API.apiRoot}/push/make_announcement`, body);
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
    return this.http.post(`${API.apiRoot}/survey/make_survey`, body);
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
    return this.http.post(`${API.apiRoot}/survey/make_survey`, body);
  }

  closeSurvey(courseCode: string): Observable<any> {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken,
      courseCode
    };
    return this.http.post(`${API.apiRoot}/survey/close_survey`, body);
  }

  getSurvey(courseCode: string, getResults = false): Observable<any> {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken,
      courseCode
    };
    if (getResults) {
      return this.http.post(`${API.apiRoot}/survey/get_results`, body);
    } else {
      return this.http.post(`${API.apiRoot}/survey/get_survey`, body);
    }
  }

  answerSurvey(courseCode, answer: string | number): Observable<any> {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.userToken,
      courseCode,
      answer
    };
    return this.http.post(`${API.apiRoot}/survey/send_answer`, body);
  }

  // util
  // updatePreferences(field: string, value: any) {
  //   const user = this.currentUser;
  //   user.preferences[field] = value;
  //   this.http.post(`${API.apiRoot}/auth/save_preferences`, user).subscribe((result: any) => {
  //     switch (result.responseCode) {
  //       case 'successful':
  //         this.currentUser = user;
  //         break;
  //     }
  //   });
  // }
  //
  // isLoggedIn(): boolean {
  //   const user = this.localStorage.getItem('user');
  //   return !!user;
  // }
  //
  // getLoggedInUser(): User {
  //   return JSON.parse(this.localStorage.getItem('user'));
  // }
  //
  // loginUser(personNumber: string, userToken: string, preferences: any) {
  //   this.currentUser = {personNumber, userToken, preferences};
  //   this.socketService.connect(this.currentUser);
  //   this.logInSubject.next(true);
  // }
  //
  // signOut() {
  //   // TODO: Confirm dialog
  //   this.currentUser = null;
  //   this.localStorage.removeItem('user');
  //   this.logInSubject.next(false);
  // }
}
