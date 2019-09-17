import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {SharedService} from '../../shared/services/shared.service';
import {UserService} from '../../shared/services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hide = true;

  form: FormGroup;
  loginFailed = false;

  constructor(
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
