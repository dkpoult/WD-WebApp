import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { SharedService } from '../shared/shared.service';
import { MatDialogRef } from '@angular/material';
import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {

  hide = true;

  form: FormGroup;
  loginFailed = false;

  constructor(
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    private sharedService: SharedService,
    private logger: NGXLogger,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      personNumber: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  hasErrors() {
    return (
      (this.form.invalid) ||
      (this.loginFailed && this.form.pristine)
    );
  }

  submit(form) {
    this.logger.debug('Attempting log in');
    const user = form.value;
    this.sharedService.authenticateUser(user).subscribe((response) => {
      switch (response.responseCode) {
        case 'successful':
          this.loginFailed = false;
          this.sharedService.loginUser(user.personNumber, response.userToken);
          this.router.navigateByUrl('/courses');
          this.dialogRef.close(true);
          break;
        default:
          this.loginFailed = true;
          this.form.markAsPristine();
          break;
      }
    });
  }

}
