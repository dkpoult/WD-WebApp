import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared/shared.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

// TODO: This component needs a guard

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss']
})
export class EditCourseComponent implements OnInit {

  gotCourse = false;
  form: FormGroup;
  courseCode: string;
  course: any;

  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedService,
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        params.getAll('code')
      )).subscribe((result: any) => {
        this.courseCode = result;
        this.getCourse();
      });
  }

  getCourse() {
    this.sharedService.getCourse(this.courseCode).subscribe((response: any) => {
      this.gotCourse = true;
      this.course = response;
      console.log(this.course.hasPassword);
      this.form = new FormGroup({
        courseCode: new FormControl(this.courseCode),
        name: new FormControl(this.course.courseName, [Validators.required]),
        description: new FormControl(this.course.courseDescription),
        password: new FormControl(''),
        clearKey: new FormControl({ value: false, disabled: !this.course.hasPassword })
      });
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
    this.sharedService.updateCourse(course).subscribe((response: any) => {
      form.markAsPristine();
      this.getCourse();
    });
  }

}
