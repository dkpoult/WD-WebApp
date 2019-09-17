import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {SharedService} from '../shared/services/shared.service';
import {Router} from '@angular/router';
import {UserService} from '../shared/services/user.service';

@Component({
  selector: 'app-signup-dialog',
  templateUrl: './signup-dialog.component.html',
  styleUrls: ['./signup-dialog.component.scss']
})
export class SignupDialogComponent implements OnInit {

  hidePassword = true;

  form: FormGroup;
  noUser = false;

  constructor(
    private dialogRef: MatDialogRef<SignupDialogComponent>,
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
      (this.noUser && this.form.pristine)
    );
  }

  submit(form) {
    const user = form.value;
    this.sharedService.linkUser(user).subscribe((response) => {
      switch (response.responseCode) {
        case 'successful':
          this.noUser = false;
          this.userService.loginUser(user.personNumber, response.userToken, response.preferences);
          this.router.navigateByUrl('/courses');
          this.dialogRef.close(true);
          break;
        default:
          this.noUser = true;
          this.form.markAsPristine();
          break;
      }
    });
  }

}
