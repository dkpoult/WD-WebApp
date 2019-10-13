import { Component, OnInit } from '@angular/core';
import {VenueNode, VenueService} from '../shared/services/venue.service';
import { PermissionService } from '../shared/services/permission.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {

  allUsers: any[] = [];

  constructor(
    private venueService: VenueService,
    private permissionService: PermissionService,
  ) { }

  ngOnInit() {
    this.venueService.updateVenues();
    this.permissionService.getAllPermissions(`g`).subscribe((response: any) => {
      switch (response.responseCode) {
        case 'successful':
          const perms = response.allPermissions;
          for (const user in perms) {
            if (perms.hasOwnProperty(user)) {
              this.allUsers.push({personNumber: user, permissions: perms[user]});
            }
          }
          break;
      }
    });
  }

  submitPermissions(permissions) {
    permissions.forEach(user => {
      this.permissionService.setPermissions(user.personNumber, user.permissions, `g`).subscribe();
    });
  }
}
