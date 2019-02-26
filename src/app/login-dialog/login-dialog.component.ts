import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<LoginDialogComponent>
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      studentnumber: '',
      password: ''
    });
  }

  submit(form) {
    this.dialogRef.close(`${form.value.studentnumber}, ${form.value.password}`);
  }

}
