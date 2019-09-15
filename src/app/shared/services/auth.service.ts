import {Injectable} from '@angular/core';
import {User} from './models';
import {HttpClient} from '@angular/common/http';
import {API} from './api';
import {UserService} from './user.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Router, UrlTree} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {
  }

  public validateCurrentUser() {
    return this.validateUser(this.userService.currentUser);
  }

  private validateUser(user: User) {
    const body = {
      personNumber: user.personNumber,
      userToken: user.userToken
    };
    return this.http.post(`${API.apiRoot}/auth/validate_token`, body);
  }
}
