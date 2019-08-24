import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SharedService} from '../shared/services/shared.service';
import {MatDialogRef} from '@angular/material';
import {Router} from '@angular/router';
import {UserService} from '../shared/services/user.service';

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
    private userService: UserService,
    private router: Router
  ) {
  }

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
    const user = form.value;
    this.sharedService.authenticateUser(user).subscribe((response) => {
      switch (response.responseCode) {
        case 'successful':
          this.loginFailed = false;
          this.userService.loginUser(user.personNumber, response.userToken, response.preferences);
          this.router.navigateByUrl('/courses');
          this.dialogRef.close(true);
          break;
        default:
          this.loginFailed = true;
          this.form.markAsPristine();
          console.log(response);
          break;
      }
    });
  }

}
