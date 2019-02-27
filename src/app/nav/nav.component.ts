import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { SignupDialogComponent } from '../signup-dialog/signup-dialog.component';
import { SharedService } from '../shared/shared.service';

export interface LoginData {
  person_number: string;
  password: string;
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

  loginDialogRef: MatDialogRef<LoginDialogComponent>;
  signupDialogRef: MatDialogRef<SignupDialogComponent>;

  constructor(private sharedService: SharedService, private breakpointObserver: BreakpointObserver, private dialog: MatDialog) { }

  // Should probably move this but i dont know where to put ti
  openLoginDialog() {
    this.loginDialogRef = this.dialog.open(LoginDialogComponent, {
      hasBackdrop: true,
      autoFocus: true,
    });
    // this.loginDialogRef
    //   .afterClosed()
    //   .subscribe((data: LoginData) => {
    //   });
  }
  openSignupDialog() {
    this.signupDialogRef = this.dialog.open(SignupDialogComponent);
  }
}
