import { API } from './api';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Permission } from './models';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  permissions: Permission[] = [];
  globalPermissions: any[] = [];
  private newPermSubject = new Subject<any>();
  newPermissions$ = this.newPermSubject.asObservable();
  private lookup: any;

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) {
  }


  updateLookups() {
    this.http.post(`${API.apiRoot}/permission/get_permission_codes `, {}).subscribe((response: any) => {
      switch (response.responseCode) {
        case 'successful':
          this.permissions = response.permissions;
          this.newPermSubject.next(this.permissions);
          this.lookup = [];
          this.permissions.forEach((permission: Permission) => {
            this.lookup[permission.identifier] = permission.value;
          });
          break;
      }
    });
  }

  setPermissions(personNumber: string, permissions: number, context: string) {
    const user = this.userService.currentUser;
    const body = {
      personNumber: user.personNumber,
      userToken: user.userToken,
      targetPersonNumber: personNumber,
      contextCode: context,
      permissions,
    };
    return this.http.post(`${API.apiRoot}/permission/set_permissions`, body);
  }

  getAllPermissions(context: string): Observable<any> {
    const user = this.userService.currentUser;
    const body = {
      personNumber: user.personNumber,
      userToken: user.userToken,
      contextCode: context
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

  togglePermission(permissions: number, identifier: string) {
    return permissions ^ this.lookup[identifier];
  }

  isAdmin(value: number | { permissions: number }): boolean {
    if (typeof (value) === 'number') {
      return this.hasPermission('EDIT_PERMISSIONS', value) || this.hasPermission('EDIT', value);
    }
    return this.hasPermission('EDIT_PERMISSIONS', value.permissions) || this.hasPermission('EDIT', value.permissions);
  }

  isLecturer(value: number | { permissions: number }): boolean {
    if (typeof (value) === 'number') {
      return this.hasPermission('EDIT_PERMISSIONS', value);
    }
    return this.hasPermission('EDIT_PERMISSIONS', value.permissions);
  }

  isTutor(value: number | { permissions: number }): boolean {
    if (typeof (value) === 'number') {
      return this.hasPermission('MODERATE', value);
    }
    return this.hasPermission('MODERATE', value.permissions);
  }
}
