import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared/shared.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

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

  dummy() {
    // this.sharedService.addDummySession(this.courseCode).subscribe(console.log);
    // console.log(this.form.controls.sessions.get('0').get('repeatType').value);
  }

  addSession() {
    const sessions = this.form.controls.sessions as FormArray;
    const newSession = new FormGroup({
      duration: new FormControl('', [Validators.required]),
      venue: new FormControl('', [Validators.required]),
      repeatType: new FormControl('', [Validators.required]),
      repeatGap: new FormControl('', [Validators.required]),
      sessionType: new FormControl('', [Validators.required]),
      nextDate: new FormControl('', [Validators.required])
    });
    sessions.push(newSession);
  }

  removeSession(i: number) {
    (this.form.get('sessions') as FormArray).removeAt(i);
  }

  getCourse() {
    this.sharedService.getCourse(this.courseCode).subscribe((response: any) => {
      this.gotCourse = true;
      this.course = response.course;

      const sessions: Array<FormGroup> = [];
      this.course.sessions.forEach(session => {
        const newSession = new FormGroup({
          duration: new FormControl(session.duration, [Validators.required]),
          venue: new FormControl(session.venue, [Validators.required]),
          repeatType: new FormControl(session.repeatType, [Validators.required]),
          repeatGap: new FormControl(session.repeatGap, [Validators.required]),
          sessionType: new FormControl(session.sessionType, [Validators.required]),
          nextDate: new FormControl(session.nextDate, [Validators.required])
        });
        sessions.push(newSession);
      });
      this.form = new FormGroup({
        courseCode: new FormControl(this.courseCode),
        name: new FormControl(this.course.courseName, [Validators.required]),
        description: new FormControl(this.course.courseDescription),
        password: new FormControl(''),
        clearKey: new FormControl({ value: false, disabled: !this.course.hasPassword }),
        sessions: new FormArray(sessions)
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
