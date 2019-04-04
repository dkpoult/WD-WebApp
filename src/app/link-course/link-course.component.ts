import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from '../shared/shared.service';
import { NGXLogger } from 'ngx-logger';
import { MatDialogRef } from '@angular/material';
import { CreateCourseComponent } from '../create-course/create-course.component';

@Component({
  selector: 'app-link-course',
  templateUrl: './link-course.component.html',
  styleUrls: ['./link-course.component.scss']
})
export class LinkCourseComponent implements OnInit {

  alreadyExists = false;
  missingPermissions = false;

  form: FormGroup;

  constructor(
    private sharedService: SharedService,
    private logger: NGXLogger,
    private dialogRef: MatDialogRef<CreateCourseComponent>
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      id: new FormControl('', [Validators.required])
    });
  }

  hasErrors() {
    return (
      (this.form.invalid) ||
      (this.alreadyExists && this.form.pristine) ||
      (this.missingPermissions && this.form.pristine)
    );
  }

  submit(form) {
    this.logger.debug('Attempting creation');
    const course = form.value;
    this.sharedService.linkCourse(course).subscribe((response) => {
      switch (response.responseCode) {
        case 'successful':
          this.dialogRef.close(true);
          break;
        case 'failed_already_exists':
          this.alreadyExists = true;
          this.form.markAsPristine();
          break;
        case 'failed_missing_perms':
          this.missingPermissions = true;
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
