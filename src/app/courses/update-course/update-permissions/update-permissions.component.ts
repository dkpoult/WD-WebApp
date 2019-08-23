import { FormControl, FormArray } from '@angular/forms';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { PermissionService } from 'src/app/shared/permission.service';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-update-permissions',
  templateUrl: './update-permissions.component.html',
  styleUrls: ['./update-permissions.component.scss'],
  animations: [
    trigger(
      'fadeInOut',
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
      ],
    ),
    trigger(
      'fadeIn',
      [
        state('hidden', style({ opacity: 0, display: 'none' })),
        state('shown', style({ opacity: 1, display: '*' })),
        transition(
          'hidden => shown',
          animate('.3s ease-in-out')
        )
      ],
    ),
    trigger(
      'growInOut',
      [
        transition(
          ':enter',
          [
            style({ transform: 'scale(0)' }),
            animate('.3s ease-out',
              style({ transform: 'scale(1)' }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ transform: 'scale(1)' }),
            animate('.3s ease-in',
              style({ transform: 'scale(0)' }))
          ]
        )
      ],
    ),
    trigger(
      'slideInOut',
      [
        transition(
          ':enter',
          [
            style({
              transform: 'translateX(-1000px)',
              opacity: 0,
              'box-shadow': '0 0 0 0 transparent'
            }),
            animate('.3s ease-out',
              style({
                transform: 'translateX(0px)',
                opacity: 1,
                'box-shadow': '*'
              }))
          ]
        ),
        transition(
          ':leave',
          [
            style({
              transform: 'translateX(0)',
              opacity: 1,
              'box-shadow': '*'
            }),
            animate('.3s ease-in',
              style({
                transform: 'translateX(-1000px)',
                opacity: 0,
                'box-shadow': '0 0 0 0 transparent'
              }))
          ]
        )
      ]
    ),
  ]
})
export class UpdatePermissionsComponent implements OnInit {

  @Output() submitPermissions = new EventEmitter<any>();
  @Input() users: Array<any> = [];

  form: FormArray;

  newPermissions$ = this.permissionService.newPermissions$;
  permissions = [];
  get gotPermissions() { return !!this.permissions; }

  displayedColumns = [
    'personNumber',
  ];

  constructor(
    private permissionService: PermissionService,
  ) { }

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

    const permissions: Array<FormControl> = this.users.map(e => new FormControl(e));
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
