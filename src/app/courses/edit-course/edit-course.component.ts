import { PostActionButtonsComponent } from './../../forum/post/post-action-buttons/post-action-buttons.component';
import { PermissionService } from './../../shared/permission.service';
import { VenueService } from '../../shared/venue.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { MatSnackBar, MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss'],
  animations: [
    trigger(
      'fade',
      [
        transition(
          ':enter',
          [
            style({ opacity: 0 }),
            animate('.3s ease-out',
              style({ opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ opacity: 1 }),
            animate('.3s ease-in',
              style({ opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class EditCourseComponent implements OnInit {

  gotPermissions = false;
  gotCourse = false;
  form: FormGroup;
  course: any;
  initialValues: any;

  users: Array<any>;
  newPermissions$ = this.permissionService.newPermissions$;
  permissions = [];

  displayedColumns = [
    'personNumber',
  ];

  lastRemoved = null;

  isHandset: boolean;

  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService,
    private venueService: VenueService,
    private permissionService: PermissionService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.permissionService.updateLookups();
    this.newPermissions$.subscribe(() => {
      this.permissions = this.permissionService.permissions;
      this.displayedColumns = [
        'personNumber',
      ];
      this.permissionService.permissions.map(e => e.identifier).forEach(e => {
        this.displayedColumns.push(e);
      });
    });
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        params.getAll('code')
      )).subscribe((result: any) => {
        this.getCourse(result);
      });
    this.sharedService.isHandset$.subscribe(result => {
      this.isHandset = result;
    });
    this.venueService.updateVenues();
  }

  get sessions() { return this.form.controls.sessions as FormArray; }

  addSession() {
    const newSession = new FormGroup({
      venue: new FormGroup({
        buildingCode: new FormControl('', [Validators.required]),
        subCode: new FormControl('', [Validators.required]),
      }),
      repeatType: new FormControl('WEEKLY', [Validators.required]),
      repeatGap: new FormControl('1', [Validators.required, Validators.min(1)]),
      sessionType: new FormControl('LECTURE', [Validators.required]),
      date: new FormControl(new Date(), [Validators.required]),
      time: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required]),
      cancellations: new FormControl([]),
      delete: new FormControl(false) // unused but still might be useful in the future
    });
    this.sessions.push(newSession);
  }

  removeSession(i: number) {
    this.form.markAsDirty();
    const removed = this.sessions.at(i);
    const snackBarRef = this.snackBar.open('Removed session', 'Undo', { duration: 2000, panelClass: ['snackbar'] });
    snackBarRef.onAction().subscribe(() => {
      this.sessions.insert(i, removed);
    });
    this.sessions.removeAt(i);
  }

  getTimeString(start: Date, duration: number) {
    return new Date(start.valueOf() + duration * 60000).toTimeString().substr(0, 5);
  }

  getCourse(courseCode: string) {
    this.form = new FormGroup({});
    this.initialValues = {};
    this.sharedService.getCourse(courseCode).subscribe((response: any) => {
      this.gotCourse = true;
      this.course = response.course;
      const sessions: Array<FormGroup> = [];
      this.course.sessions.forEach(session => {
        const date = new Date(session.nextDate);
        let dateStr;
        let timeStr;
        let endStr;
        if (date.toString() === 'Invalid Date') {
          dateStr = '';
          timeStr = '';
          endStr = '';
        } else {
          dateStr = date.toISOString();
          timeStr = date.toTimeString().substr(0, 5);
          endStr = this.getTimeString(date, session.duration);
        }
        if (!session.venue) {
          session.venue = { building: null, room: null };
        }
        if (!session.cancellations) {
          session.cancellations = [];
        }
        session.cancellations.forEach(cancel => {
          cancel = new Date(cancel);
        });
        const newSession = new FormGroup({
          venue: new FormGroup({
            buildingCode: new FormControl(session.venue.buildingCode, [Validators.required]),
            subCode: new FormControl(session.venue.subCode, [Validators.required]),
          }),
          repeatType: new FormControl(session.repeatType, [Validators.required]),
          repeatGap: new FormControl(session.repeatGap, [Validators.required]),
          sessionType: new FormControl(session.sessionType, [Validators.required]),
          date: new FormControl(dateStr, [Validators.required]),
          time: new FormControl(timeStr, [Validators.required]),
          endTime: new FormControl(endStr, [Validators.required]),
          cancellations: new FormControl(session.cancellations),
          delete: new FormControl(false)
        });
        sessions.push(newSession);
      });
      this.form.addControl('courseCode', new FormControl(this.course.courseCode));
      this.initialValues.courseCode = this.course.courseCode;
      this.form.addControl('name', new FormControl(this.course.courseName, [Validators.required]));
      this.initialValues.name = this.course.courseName;
      this.form.addControl('description', new FormControl(this.course.courseDescription));
      this.initialValues.description = this.course.courseDescription;
      this.form.addControl('password', new FormControl(''));
      this.initialValues.password = '';
      this.form.addControl('clearKey', new FormControl({ value: false, disabled: !this.course.hasPassword }));
      this.initialValues.clearKey = false;
      this.form.addControl('sessions', new FormArray(sessions));
      this.initialValues.sessions = sessions;
    });
    this.permissionService.getAllPermissions(courseCode).subscribe((response: any) => {
      switch (response.responseCode) {
        case 'successful':
          const perms = response.allPermissions;

          this.users = [];
          for (const user in perms) {
            if (perms.hasOwnProperty(user)) {
              this.users.push({ personNumber: user, permissions: perms[user] });
            }
          }

          const permissions: Array<FormControl> = this.users.map(e => new FormControl(e));
          this.form.addControl('permissions', new FormArray(permissions));
          this.initialValues.permissions = this.users;
          this.gotPermissions = true;
          break;
      }
    });
  }

  hasErrors() {
    return (
      (this.form.invalid)
      || (this.form.pristine)
      || (!this.hasLecturers())
    );
  }

  hasLecturers(): boolean {
    const permissions = this.form.value.permissions;
    if (isNullOrUndefined(permissions)) { return; }
    let flag = false;
    permissions.forEach(permission => {
      if (this.hasPermission('EDIT_PERMISSIONS', permission.permissions)) {
        flag = true;
        return;
      }
    });
    return flag;
  }

  toggleClearKey() {
    if (this.form.controls.password.disabled) {
      this.form.controls.password.enable();
    } else {
      this.form.controls.password.disable();
    }
  }

  submit(form) {
    const course = form.value;
    course.sessions.forEach((session: any) => {
      session.duration = this.timeBetween(session.time, session.endTime);
      delete session.endTime;
    });
    this.sharedService.updateCourse(course).subscribe((response: any) => {
      form.markAsPristine();
    });
    form.value.permissions.forEach(user => {
      this.permissionService.setPermissions(user.personNumber, user.permissions, this.course.courseCode).subscribe((response: any) => {
        switch (response.responseCode) {
          case 'successful':
            form.controls.permissions.markAsPristine();
            break;
        }
      });
    });
  }

  // TODO: Move this to a utils file
  timeBetween(start: string, end: string) {
    const startH = parseInt(start.substr(0, 2), 10);
    const startM = parseInt(start.substr(3, 2), 10);
    const endH = parseInt(end.substr(0, 2), 10);
    const endM = parseInt(end.substr(3, 2), 10);

    let h = endH - startH;
    const m = endM - startM;
    if (endH < startH) {
      // We have crossed midnight
      h = (24 - startH) + endH;
    }
    return m + 60 * h;
  }

  confirmAndQuit() {
    if (this.form.pristine) {
      this.router.navigate(['courses']);
      return;
    }
    this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'There are unsaved changes. Are you sure you want to discard them?'
    });
    this.confirmDialogRef.afterClosed().subscribe((response: boolean) => {
      if (response) {
        this.router.navigate(['courses']);
      }
    });
  }

  hasPermission(identifier: string, permissions: number) {
    return this.permissionService.hasPermission(identifier, permissions);
  }

  getDisplayString(text: string): string {
    return text.replace(/_/g, ' ').toLowerCase();
  }

  togglePermission(user: any, identifier: string) {
    if (this.hasPermission(identifier, user.permissions)) {
      user.permissions = this.permissionService.removePermission(user.permissions, identifier);
    } else {
      user.permissions = this.permissionService.addPermission(user.permissions, identifier);
    }
    this.form.controls.permissions.markAsDirty();
  }
}
