import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MatSidenav } from '@angular/material';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { SignupDialogComponent } from '../signup-dialog/signup-dialog.component';
import { SharedService } from '../shared/shared.service';
import { Router } from '@angular/router';
import { ThemeService } from '../shared/theme.service';

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

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  loginDialogRef: MatDialogRef<LoginDialogComponent>;
  signupDialogRef: MatDialogRef<SignupDialogComponent>;

  @ViewChild('drawer') drawer: MatSidenav;

  // Add menu items here for when logged in
  // Remember to add to app-routing.module.ts too
  menuItemsLoggedIn: Array<MenuItem> = [
    { path: 'courses', text: 'Courses' }
  ];

  // Add menu items here for when NOT logged in
  // Remember to add to app-routing.module.ts too
  menuItemsLoggedOut: Array<MenuItem> = [
    { path: 'features', text: 'Features' },
  ];

  isDarkMode$: Observable<boolean>;

  constructor(
    private sharedService: SharedService,
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private router: Router,
    private theme: ThemeService) { }

  ngOnInit(): void {
    this.isDarkMode$ = this.theme.isDarkMode$;
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
    // TODO: Are you sure? dialog
    this.router.navigateByUrl('');
    this.sharedService.signOut();
  }

  loggedIn() {
    return this.sharedService.isLoggedIn();
  }

  toggleDarkMode(checked: boolean) {
    this.theme.setDarkMode(checked);
  }
}
