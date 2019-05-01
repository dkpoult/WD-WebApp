import { Injectable, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { User } from './user';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public apiRoot: string;
  public currentUser: User;
  public localStorage: any = window.localStorage;

  constructor(private http: HttpClient, private logger: NGXLogger) { }

  // Gets called from app.module when the system starts up
  initialise(): void {
    this.apiRoot = 'https://wd.dimensionalapps.com'; // TODO: Hack, rather make everything wait for initialisation first
    this.currentUser = this.getLoggedInUser();
    this.http.get<any>(`./assets/apiUrl.json`).subscribe((response) => { this.apiRoot = response.api; });
  }

  // Authentication
  linkUser(user: User): Observable<any> {
    return this.http.post(`${this.apiRoot}/auth/register`, user);
  }

  authenticateUser(user: User): Observable<any> {
    return this.http.post(`${this.apiRoot}/auth/login`, user);
  }

  // Courses
  getCourses(): Observable<any> {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.token
    };
    return this.http.post(`${this.apiRoot}/course/get_courses`, body);
  }

  getCourse(courseCode: string): Observable<any> {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.token,
      courseCode
    };
    return this.http.post(`${this.apiRoot}/course/get_course`, body)
      .pipe(map((result: any) => {
        return { responseCode: result.responseCode, course: result.courses[0] }; // POST responds with array of single course
      })); // TODO: Will give issues when the POST fails and no courses array is returned
  }

  getAvailableCourses() {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.token
    };
    return this.http.post(`${this.apiRoot}/course/get_available_courses`, body);
  }

  enrolInCourse(course: any, password?: string) {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.token,
      courseCode: course,
      password
    };
    return this.http.post(`${this.apiRoot}/course/enrol_in_course`, body);
  }

  createCourse(course: any): Observable<any> {
    const body = {
      courseCode: course.code,
      courseName: course.name,
      courseDescription: course.description ? course.description : '',
      password: course.password ? course.password : undefined,
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.token,
    };
    return this.http.post(`${this.apiRoot}/course/create_course`, body);
  }

  updateCourse(newInfo: any): Observable<any> {
    const body = {
      courseCode: newInfo.courseCode,
      courseName: newInfo.name,
      courseDescription: newInfo.description,
      sessions: newInfo.sessions,
      password: newInfo.clearKey ? '' : newInfo.password,
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.token
    };
    return this.http.post(`${this.apiRoot}/course/update_course`, body);
  }

  linkCourse(course: any): Observable<any> {
    const body = {
      courseId: course.id,
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.token
    };
    return this.http.post(`${this.apiRoot}/course/link_course`, body);
  }

  // Forum
  getPosts(forum: string): Observable<any> {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.token,
      forumCode: forum
    };
    return this.http.post(`${this.apiRoot}/forum/get_posts`, body);
  }

  getPost(post: string): Observable<any> {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.token,
      postCode: post
    };
    return this.http.post(`${this.apiRoot}/get_post`, body)
      .pipe(map((result: any) => {
        return { responseCode: result.responseCode, post: result.posts[0] }; // POST responds with array of single post
      })); // TODO: Will give issues when the POST fails and no posts array is returned
  }

  makePost(post: any): Observable<any> {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.token,
      forumCode: post.forum,
      title: post.title,
      body: post.body
    };
    return this.http.post(`${this.apiRoot}/forum/make_post`, body);
  }

  makeComment(post: any, comment: string): Observable<any> {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.token,
      postCode: post.code,
      body: comment
    };
    return this.http.post(`${this.apiRoot}/forum/make_comment`, body);
  }

  markAsAnswer(postCode: string, commentCode: string) {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.token,
      postCode,
      commentCode
    };
    return this.http.post(`${this.apiRoot}/forum/set_answer`, body);
  }

  vote(post: any, vote: number) {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.token,
      postCode: post.code,
      vote
    };
    return this.http.post(`${this.apiRoot}/forum/make_vote`, body);
  }

  // Push
  makeAnnouncement(courseCode: string, announcement: any) {
    const body = {
      personNumber: this.currentUser.personNumber,
      userToken: this.currentUser.token,
      body: announcement.body,
      title: announcement.title,
      courseCode,
    };
    return this.http.post(`${this.apiRoot}/push/make_announcement`, body);
  }

  isLoggedIn(): boolean {
    const user = this.localStorage.getItem('user');
    return !!user;
  }

  getLoggedInUser(): User {
    return JSON.parse(this.localStorage.getItem('user'));
  }

  loginUser(personNumber: string, token: string) {
    this.localStorage.setItem('user', JSON.stringify(new User(personNumber, token)));
    this.currentUser = this.getLoggedInUser();
    this.logger.debug(`Logged in user ${personNumber} with token ${token}`);
  }

  userIsValid(): any {
    return this.isLoggedIn();
  }

  signOut() {
    // TODO: Confirm dialog
    this.localStorage.removeItem('user');
    this.currentUser = null;
  }
}
