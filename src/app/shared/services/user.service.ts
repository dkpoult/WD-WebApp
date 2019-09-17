import {Injectable} from '@angular/core';
import {User} from './models';
import {Subject} from 'rxjs';
import {isNullOrUndefined} from 'util';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {ThemeService} from './theme.service';
import {API} from './api';
import {SocketService} from './socket.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private localStorage = window.localStorage;
  private logInSubject = new Subject<boolean>();

  public loggedIn$ = this.logInSubject.asObservable(); // Emits when the user logs in or out

  constructor(
    private themeService: ThemeService,
    private socketService: SocketService,
    private http: HttpClient
  ) {
    this.loggedIn$.subscribe((value) => {
      console.log(value ? 'Logged in' : 'Not logged in');
      this._loggedIn = value;
      if (value) {
        let darkMode = false;
        if (isNullOrUndefined(this.currentUser.preferences)) {
          this.currentUser.preferences = {};
        }
        if (!isNullOrUndefined(this.currentUser.preferences.darkMode)) {
          darkMode = coerceBooleanProperty(this.currentUser.preferences.darkMode);
        }
        setTimeout(() => {
          this.themeService.setDarkMode(darkMode);
        }, 100);
      }
    });
    if (!!this.storedUser) {
      this.currentUser = this.storedUser;
      this.logInSubject.next(true);
      this.socketService.connect(this.currentUser);
    }
  }

  private _currentUser;

  get currentUser(): User {
    return this._currentUser;
  }

  set currentUser(value: User) {
    this.localStorage.setItem(`user`, JSON.stringify(value));
    this._currentUser = value;
  }

  private _loggedIn: boolean;

  get loggedIn() {
    return this._loggedIn;
  }

  set loggedIn(value) {
    this.logInSubject.next(value);
  }

  private get storedUser() {
    return JSON.parse(this.localStorage.getItem('user')) as User;
  }

  updatePreferences(field: string, value: any) {
    const user = this.currentUser;
    user.preferences[field] = value;
    this.http.post(`${API.apiRoot}/auth/save_preferences`, user).subscribe((result: any) => {
      switch (result.responseCode) {
        case 'successful':
          this.currentUser = user;
          break;
      }
    });
  }

  loginUser(personNumber: string, userToken: string, preferences: any) {
    this.currentUser = {personNumber, userToken, preferences};
    this.socketService.connect(this.currentUser);
    this.loggedIn = true;
  }

  signOut() {
    // TODO: Confirm dialog
    this.currentUser = null;
    this.localStorage.removeItem('user');
    this.logInSubject.next(false);
  }
}
