import { SharedService } from 'src/app/shared/shared.service';
import { API } from './api';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { Observable, Subject } from 'rxjs';

interface Permission {
  identifier: string;
  value: number;
}

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private newPermSubject = new Subject<void>();
  newPermissions$ = this.newPermSubject.asObservable();
  permissions: Array<Permission> = [];
  private lookup: any;

  constructor(
    private http: HttpClient
  ) { }


  updateLookups() {
    this.http.post(`${API.apiRoot}/permission/get_permission_codes `, {}).subscribe((response: any) => {
      switch (response.responseCode) {
        case 'successful':
          this.permissions = response.permissions;
          this.newPermSubject.next();
          this.lookup = [];
          this.permissions.forEach((permission: Permission) => {
            this.lookup[permission.identifier] = permission.value;
          });
          break;
      }
    });
  }

  setPermissions(personNumber: string, permissions: number, courseCode: string) {
    const user = JSON.parse(window.localStorage.getItem('user')); // ! Thats nasty. Logged In user should be extracted to a new service
    const body = {
      personNumber: user.personNumber,
      userToken: user.userToken,
      targetPersonNumber: personNumber,
      contextCode: `c${courseCode}`,
      permissions,
    };
    return this.http.post(`${API.apiRoot}/permission/set_permissions`, body);
  }

  getAllPermissions(courseCode: string): Observable<any> {
    const user = JSON.parse(window.localStorage.getItem('user')); // ! Thats nasty. Logged In user should be extracted to a new service
    const body = {
      personNumber: user.personNumber,
      userToken: user.userToken,
      contextCode: `c${courseCode}`
    };

    return this.http.post(`${API.apiRoot}/permission/get_all_permissions`, body);
  }

  hasPermission(identifier: string, permissions: number): boolean {
    const value = this.lookup[identifier];
    return ((permissions & value) > 0);
  }

  addPermission(permissions: number, identifier: string) {
    return permissions | this.lookup[identifier];
  }

  removePermission(permissions: number, identifier: string) {
    return permissions ^ this.lookup[identifier];
  }

  isLecturer(value: any): boolean {
    if (typeof (value) === 'number') {
      return this.hasPermission('EDIT_PERMISSIONS', value);
    }
    return this.hasPermission('EDIT_PERMISSIONS', value.permissions);
  }

  isTutor(value: any): boolean {
    if (typeof (value) === 'number') {
      return this.hasPermission('MODERATE', value);
    }
    return this.hasPermission('MODERATE', value.permissions);
  }
}
