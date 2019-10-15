import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { SharedService } from '../../shared/services/shared.service';
import { UserService } from '../../shared/services/user.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

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
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  redirect = 'courses';

  ngOnInit() {
    this.form = new FormGroup({
      personNumber: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        params.getAll('redirect')
      ))
      .subscribe((result: any) => {
        this.redirect = atob(result);
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
          this.router.navigateByUrl(this.redirect);
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
