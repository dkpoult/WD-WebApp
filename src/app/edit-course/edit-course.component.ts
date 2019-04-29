import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { SharedService } from '../shared/shared.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss']
})
export class EditCourseComponent implements OnInit {

  courseCode: string;

  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogRef: MatDialogRef<EditCourseComponent>,
    private sharedService: SharedService,
  ) { }

  ngOnInit() {
    this.courseCode = this.data.courseCode;
    this.form = new FormGroup({
      courseCode: new FormControl(this.courseCode),
      name: new FormControl(this.data.courseName, [Validators.required]),
      description: new FormControl(this.data.courseDescription),
      password: new FormControl(''),
      clearKey: new FormControl(false)
    });
  }

  hasErrors() {
    return (
      (this.form.invalid) ||
      (this.form.pristine)
    );
  }

  toggleClearKey() {
    if (this.form.controls.password.disabled) {
      this.form.controls.password.enable();
    } else {
      this.form.controls.password.disable();
    }
  }

  submit(form) {
    const course = form.value;
    this.sharedService.updateCourse(course).subscribe((response) => {
      switch (response.responseCode) {
        case 'successful':
          this.dialogRef.close(course);
          break;
        default:
          this.form.markAsPristine();
          break;
      }
    });
  }

}
