import { Component, Inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { SignupDialogComponent } from '../signup-dialog/signup-dialog.component';
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

  constructor(private breakpointObserver: BreakpointObserver, private dialog: MatDialog) { }

  openLoginDialog() {
    this.loginDialogRef = this.dialog.open(LoginDialogComponent, {
      hasBackdrop: true,
      autoFocus: true,
    });
    this.loginDialogRef
      .afterClosed()
      .subscribe();
  }
  openSignupDialog() {
    this.signupDialogRef = this.dialog.open(SignupDialogComponent);
  }
}
