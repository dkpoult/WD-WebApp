import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { SharedService } from '../shared/shared.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-confirm-enrolment',
  templateUrl: './confirm-enrolment.component.html',
  styleUrls: ['./confirm-enrolment.component.scss']
})
export class ConfirmEnrolmentComponent implements OnInit {

  form: FormGroup;
  wrongPassword = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<ConfirmEnrolmentComponent>,
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      password: new FormControl('', [Validators.required])
    });
  }

  hasErrors() {
    return (
      (this.data.password && this.form.invalid) ||
      (this.wrongPassword && this.form.pristine)
    );
  }

  submit(form?: FormGroup) {
    this.sharedService.enrolInCourse(this.data.code, form.controls.password.value).subscribe((response: any) => {
      switch (response.responseCode) {
        case 'successful':
          this.dialogRef.close(true);
          break;
        case 'failed_invalid_params':
          this.wrongPassword = true;
          this.form.markAsPristine();
          break;
        default:
          console.log(response);
          this.form.markAsPristine();
          break;
      }
    });
  }

}
