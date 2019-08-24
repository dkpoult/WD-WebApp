import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { SharedService } from '../shared/shared.service';
import { Router } from '@angular/router';

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
      (this.noUser && this.form.pristine)
    );
  }

  submit(form) {
    const user = form.value;
    this.sharedService.linkUser(user).subscribe((response) => {
      switch (response.responseCode) {
        case 'successful':
          this.noUser = false;
          this.sharedService.loginUser(user.personNumber, response.userToken, response.preferences);
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
