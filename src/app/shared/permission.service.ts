import { API } from './api';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isNullOrUndefined } from 'util';

interface Permission {
  identifier: string;
  value: number;
}

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private permissions: Array<Permission>;

  constructor(
    private http: HttpClient,
  ) { }

  updateLookups() {
    this.http.post(`${API.apiRoot}/permission/get_permission_codes `, {}).subscribe((response: any) => {
      switch (response.responseCode) {
        case 'successful':
          this.permissions = response.permissions;
          break;
      }
    });
  }

  hasPermission(identifier: string, permissions: number): boolean {
    let value;
    if (isNullOrUndefined(this.permissions)) { return false; }
    this.permissions.forEach(permission => {
      if (permission.identifier === identifier) {
        value = permission.value;
      }
    });
    return ((permissions & value) > 0);
  }
}
