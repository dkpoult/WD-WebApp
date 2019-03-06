import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { SharedService } from '../shared/shared.service';
import { MatDialogRef } from '@angular/material';
import { NGXLogger } from 'ngx-logger'; 
import { Router } from '@angular/router';


@Component({
  selector: 'app-link-account',
  templateUrl: './link-account.component.html',
  styleUrls: ['./link-account.component.css']
})
export class LinkAccountComponent implements OnInit {

  hide = true;

  form: FormGroup;
  loginFailed = true;

  constructor(
    private dialogRef: MatDialogRef<LinkAccountComponent>,
    private sharedService: SharedService,
    private logger: NGXLogger,
    private router: Router,
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      StudentNumber: new FormControl('', [Validators.required]),
      Password: new FormControl('', [Validators.required])
    });
  }

  hasErrors() {
    return (
      this.form.controls.StudentNumber.hasError('required') ||
      this.form.controls.Password.hasError('required') ||
      this.form.controls.Password1.hasError('required') ||
      (this.loginFailed && !this.form.dirty)
    );
  }
  validatePassword(){
    if(this.form.controls.Password!= this.form.controls.Password1.value) {
      alert("Passwords Don't Match");
    } 
  }

  submit(form) {
    this.logger.debug('Linking Accounts');
    const data = form.value;
    this.sharedService.authenticateUser(data).subscribe((response) => {
      switch (response.responseCode) {
        case 'successful':
          this.loginFailed = false;
          this.sharedService.loginUser(data.StudentNumber, response.userToken);
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