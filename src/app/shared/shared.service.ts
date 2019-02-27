import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public apiRoot: string;

  constructor(private http: HttpClient, private logger: NGXLogger) { }

  // Gets called from app.module when the system starts up
  initialise(): void {
    this.logger.debug('SharedService initialise()');
    this.http.get<any>(`./assets/apiUrl.json`).subscribe((response) => { this.apiRoot = response.api; });
  }

  authenticateUser(user: any): Observable<any> {
    return this.http.post(`${this.apiRoot}/login`, user);
  }

  loginUser(personNumber: string, token: string) {
    this.logger.debug(`Logged in user ${personNumber} with token ${token}`);
  }
}
