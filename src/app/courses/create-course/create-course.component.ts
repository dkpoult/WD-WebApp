import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from '../../shared/services/shared.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss']
})
export class CreateCourseComponent implements OnInit {

  alreadyExists = false;

  form: FormGroup;

  constructor(
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<CreateCourseComponent>
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      code: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', []),
      password: new FormControl('', [])
    });
  }

  hasErrors() {
    return (
      (this.form.invalid) ||
      (this.alreadyExists && this.form.pristine)
    );
  }

  submit(form) {
    const course = form.value;
    this.sharedService.createCourse(course).subscribe((response) => {
      switch (response.responseCode) {
        case 'successful':
          this.dialogRef.close(true);
          break;
        case 'failed_already_exists':
          this.alreadyExists = true;
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
