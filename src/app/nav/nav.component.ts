import { PermissionService } from 'src/app/shared/services/permission.service';
import { ConfirmDialogComponent } from './../confirm-dialog/confirm-dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef, MatSidenav, MatSlideToggle } from '@angular/material';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { SignupDialogComponent } from '../signup-dialog/signup-dialog.component';
import { SharedService } from '../shared/services/shared.service';
import { Router } from '@angular/router';
import { ThemeService } from '../shared/services/theme.service';
import { UserService } from '../shared/services/user.service';

export interface MenuItem {
  path: string;
  text: string;
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  isHandset$: Observable<boolean> = this.sharedService.isHandset$;

  loginDialogRef: MatDialogRef<LoginDialogComponent>;
  signupDialogRef: MatDialogRef<SignupDialogComponent>;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  @ViewChild('drawer') drawer: MatSidenav;
  @ViewChild('darkMode') lightSwitch: MatSlideToggle;

  // Add menu items here for when logged in
  // Remember to add to app-routing.module.ts too
  menuItemsLoggedIn: MenuItem[] = [
    { path: 'admin/', text: 'Admin' },
    { path: 'courses/', text: 'Courses' },
    { path: 'timetable/', text: 'Timetable' },
    { path: 'map/', text: 'Map' },
  ];
  // Add menu items here for when not logged in
  menuItemsLoggedOut: MenuItem[] = [
    // { path: 'features/', text: 'Features' },
    { path: 'map/', text: 'Map' }
  ];

  isDarkMode$: Observable<boolean>;

  globalPermissions;

  constructor(
    private sharedService: SharedService,
    private userService: UserService,
    private permissionService: PermissionService,
    private dialog: MatDialog,
    private router: Router,
    private theme: ThemeService,
  ) {
  }

  //
  // get user() {
  //   return this.userService.currentUser;
  // }

  ngOnInit(): void {
    this.isDarkMode$ = this.theme.isDarkMode$;
    this.permissionService.getAllPermissions('g').subscribe(r => {
      this.globalPermissions = r.permissions;
    });
  }

  openLoginDialog() {
    this.loginDialogRef = this.dialog.open(LoginDialogComponent);
    this.loginDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.drawer.close();
      }
    });
  }

  openSignupDialog() {
    this.signupDialogRef = this.dialog.open(SignupDialogComponent);
  }

  signOut() {
    this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Are you sure you want to sign out?'
    });
    this.confirmDialogRef.afterClosed().subscribe((response: boolean) => {
      if (response) {
        this.router.navigateByUrl('');
        this.userService.signOut();
      }
    });
  }

  isAdmin() {
    return this.permissionService
      .isAdmin(this.globalPermissions[this.userService.currentUser.personNumber]);
  }

  loggedIn() {
    return this.userService.loggedIn;
  }

  toggleDarkMode(checked: boolean) {
    this.theme.setDarkMode(checked);
    if (this.userService.loggedIn) {
      this.userService.updatePreferences('darkMode', checked);
    }
  }
}
