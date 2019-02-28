import { Injectable } from '@angular/core';
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

  user: User;

  constructor(private http: HttpClient, private logger: NGXLogger) { }

  // Gets called from app.module when the system starts up
  initialise(): void {
    this.http.get<any>(`./assets/apiUrl.json`).subscribe((response) => { this.apiRoot = response.api; });
  }

  authenticateUser(user: User): Observable<any> {
    return this.http.post(`${this.apiRoot}/login`, user);
  }

  authenticateToken(user: User): Observable<boolean> {
    return this.http.post(`${this.apiRoot}/login`, user)
      .pipe(
        map((response: any) => response.result)
      );
  }

  isLoggedIn(): boolean {
    // TODO: Validate token
    // TODO: Actually save user as logged in
    return this.user ? true : false;
    // return of(this.user ? true : false); // Makes this an observable, but I don't know how to make use of that
  }

  loginUser(personNumber: string, token: string) {
    this.user = new User(personNumber, token);
    this.logger.debug(`Logged in user ${personNumber} with token ${token}`);
  }

  signOut() {
    // TODO: Confirm dialog
    this.logger.debug(`Logged out user ${this.user.personNumber}`);
    this.user = null;
  }
}
