import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from '../shared/shared.service';
import { NGXLogger } from 'ngx-logger';
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
    private logger: NGXLogger,
    private dialogRef: MatDialogRef<CreateCourseComponent>
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      code: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [])
    });
  }

  hasErrors() {
    return (
      this.form.controls.code.hasError('required') ||
      this.form.controls.name.hasError('required') ||
      (this.alreadyExists && !this.form.dirty)
    );
  }

  submit(form) {
    this.logger.debug('Attempting creation');
    const course = form.value;
    this.sharedService.createCourse(course).subscribe((response) => {
      console.log(response);
      switch (response.responseCode) {
        case 'successful':
          this.dialogRef.close(true);
          break;
        case 'failed_already_exists':
          this.alreadyExists = true;
          this.form.markAsPristine();
          break;
        default:
          this.form.markAsPristine();
          break;
      }
    });
  }
}
