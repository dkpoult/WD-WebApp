import { SharedService } from './../../shared/shared.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PermissionService } from 'src/app/shared/permission.service';
import { VenueService } from 'src/app/shared/venue.service';

@Component({
  selector: 'app-update-course',
  templateUrl: './update-course.component.html',
  styleUrls: ['./update-course.component.scss']
})
export class UpdateCourseComponent implements OnInit {

  get gotCourse() { return !!this.course; }

  courseCode: string;
  course: any;
  users: Array<any> = [];

  get sessionCount() { return 0; }

  constructor(
    private permissionService: PermissionService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        params.getAll('code')
      )).subscribe((result: any) => {
        this.courseCode = result;
        this.getCourse();
        this.getPermissions();
      });
  }

  getCourse() {
    this.sharedService.getCourse(this.courseCode).subscribe((result: any) => {
      switch (result.responseCode) {
        case 'successful':
          this.course = result.course;
          break;
      }
    });
  }

  getPermissions() {
    this.permissionService.getAllPermissions(this.courseCode).subscribe((response: any) => {
      switch (response.responseCode) {
        case 'successful':
          const perms = response.allPermissions;

          for (const user in perms) {
            if (perms.hasOwnProperty(user)) {
              this.users.push({ personNumber: user, permissions: perms[user] });
            }
          }
          break;
      }
    });
  }

  canEditDetails(): boolean {
    return this.permissionService.hasPermission('EDIT', this.course.permissions);
  }

  canEditSessions(): boolean {
    return this.permissionService.hasPermission('EDIT', this.course.permissions);
  }

  canEditPermissions(): boolean {
    return this.permissionService.hasPermission('EDIT_PERMISSIONS', this.course.permissions);
  }

  submitCourse(details) {
    this.sharedService.updateCourseDetails(this.courseCode, details).subscribe((response: any) => {
      switch (response.responseCode) {
        case 'successful':
          this.getCourse();
          break;
      }
    });
  }

  submitSessions(sessions) {
    this.sharedService.updateSessions(this.courseCode, sessions).subscribe((response: any) => {
      switch (response.responseCode) {
        case 'successful':
          break;
      }
    });
  }

  submitPermissions(permissions) {
    permissions.forEach(user => {
      this.permissionService.setPermissions(user.personNumber, user.permissions, this.course.courseCode).subscribe();
    });
  }

}
