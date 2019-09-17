import {FormArray, FormControl} from '@angular/forms';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PermissionService} from 'src/app/shared/services/permission.service';
import {animate, sequence, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-update-permissions',
  templateUrl: './update-permissions.component.html',
  styleUrls: ['./update-permissions.component.scss'],
  animations: [
    trigger(
      'fadeSlideInOut',
      [
        transition(
          ':enter',
          [
            style({width: 0, opacity: 0}),
            sequence([
              animate('.3s ease-out',
                style({width: '*'})
              ),
              animate('.3s ease-out',
                style({opacity: '*'})
              )
            ])
          ]
        ),
        transition(
          ':leave',
          [
            style({width: '*'}),
            sequence([
              animate('.3s ease-in',
                style({opacity: 0})
              ),
              animate('.3s ease-in',
                style({width: 0})
              )
            ])
          ]
        )
      ],
    ),
  ]
})
export class UpdatePermissionsComponent implements OnInit {

  @Output() submitPermissions = new EventEmitter<any>();
  @Input() users: any[] = [];

  form: FormArray;

  newPermissions$ = this.permissionService.newPermissions$;
  permissions = [];
  displayedColumns = [
    'personNumber',
  ];

  constructor(
    private permissionService: PermissionService,
  ) {
  }

  get gotPermissions() {
    return !!this.permissions;
  }

  ngOnInit() {
    this.newPermissions$.subscribe((newPermissions: any) => {
      this.permissions = newPermissions;
      this.displayedColumns = [
        'personNumber',
      ];
      this.permissions.map(e => e.identifier).forEach(e => {
        this.displayedColumns.push(e);
      });
    });
    this.permissionService.updateLookups();

    const permissions: FormControl[] = this.users.map(e => new FormControl(e));
    this.form = new FormArray(permissions);
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
    this.form.markAsDirty();
  }

  hasLecturers(): boolean {
    let flag = false;
    this.form.value.forEach(user => {
      if (this.hasPermission('EDIT_PERMISSIONS', user.permissions)) {
        flag = true;
        return;
      }
    });
    return flag;
  }

  canSubmit() {
    return (
      this.form.dirty &&
      this.hasLecturers()
    );
  }

  log(message) {
    console.log(message);
  }

  submit() {
    this.submitPermissions.next(this.users);
    this.form.markAsPristine();
  }

}
