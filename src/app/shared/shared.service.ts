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

  getCourses(): Observable<any> {
    const user = this.getLoggedInUser();
    const body = {
      personNumber: user.personNumber,
      userToken: user.token
    };
    return this.http.post(`${this.apiRoot}/get_courses`, body);
  }

  getAvailableCourses() {
    const user = this.getLoggedInUser();
    const body = {
      personNumber: user.personNumber,
      userToken: user.token
    };
    return this.http.post(`${this.apiRoot}/get_available_courses`, body);
  }

  enrolInCourse(course: any, password?: string) {
    const user = this.getLoggedInUser();
    const body = {
      personNumber: user.personNumber,
      userToken: user.token,
      courseCode: course,
      password
    };
    return this.http.post(`${this.apiRoot}/enrol_in_course`, body);
  }

  createCourse(course: any): Observable<any> {
    const user = this.getLoggedInUser();
    const body = {
      courseCode: course.code,
      courseName: course.name,
      courseDescription: course.description ? course.description : '',
      password: course.password ? course.password : undefined,
      personNumber: user.personNumber,
      userToken: user.token,
    };
    return this.http.post(`${this.apiRoot}/create_course`, body);
  }

  linkCourse(course: any): Observable<any> {
    const user = this.getLoggedInUser();
    const body = {
      courseId: course.id,
      personNumber: user.personNumber,
      userToken: user.token
    };
    return this.http.post(`${this.apiRoot}/link_course`, body);
  }

  getPosts(forum: string): Observable<any> {
    const user = this.getLoggedInUser();
    const body = {
      personNumber: user.personNumber,
      userToken: user.token,
      forumCode: forum
    };
    return this.http.post(`${this.apiRoot}/get_posts`, body);
  }

  getPost(post: string): Observable<any> {
    const user = this.getLoggedInUser();
    const body = {
      personNumber: user.personNumber,
      userToken: user.token,
      postCode: post
    };
    return this.http.post(`${this.apiRoot}/get_post`, body)
      .pipe(map((result: any) => {
        return { responseCode: result.responseCode, post: result.posts[0] }; // POST responds with array of single post
      }));
  }

  makePost(post: any): Observable<any> {
    const user = this.getLoggedInUser();
    const body = {
      personNumber: user.personNumber,
      userToken: user.token,
      forumCode: post.forum,
      title: post.title,
      body: post.body
    };
    return this.http.post(`${this.apiRoot}/make_post`, body);
  }

  makeComment(post: any, comment: string): Observable<any> {
    const user = this.getLoggedInUser();
    const body = {
      personNumber: user.personNumber,
      userToken: user.token,
      postCode: post.code,
      body: comment
    };
    return this.http.post(`${this.apiRoot}/make_comment`, body);
  }

  vote(post: any, vote: number) {
    const user = this.getLoggedInUser();
    const body = {
      personNumber: user.personNumber,
      userToken: user.token,
      postCode: post.code,
      vote
    };
    return this.http.post(`${this.apiRoot}/make_vote`, body);
  }

  isLoggedIn(): boolean {
    const user = this.localStorage.getItem('user');
    if (!user) {
      return false;
    }
    return true;
  }

  getLoggedInUser(): User {
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
