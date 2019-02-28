import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { SignupDialogComponent } from '../signup-dialog/signup-dialog.component';
import { SharedService } from '../shared/shared.service';

export interface MenuItem {
  routerLink: string;
  text: string;
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  // isLoggedIn$: Observable<boolean> = this.sharedService.isLoggedIn(); // TODO: Make this work

  loginDialogRef: MatDialogRef<LoginDialogComponent>;
  signupDialogRef: MatDialogRef<SignupDialogComponent>;

  // Add menu items here for NOT logged in
  // Remember to add to app-routing.module.ts too
  menuItems: Array<MenuItem> = [
    { routerLink: 'features', text: 'Features' },
  ];

  constructor(private sharedService: SharedService, private breakpointObserver: BreakpointObserver, private dialog: MatDialog) { }

  // Should probably move this but i dont know where to put ti
  openLoginDialog() {
    this.loginDialogRef = this.dialog.open(LoginDialogComponent);
  }
  openSignupDialog() {
    this.signupDialogRef = this.dialog.open(SignupDialogComponent);
  }
}
