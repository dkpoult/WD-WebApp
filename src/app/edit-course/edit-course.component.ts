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
  course: any;

  isHandset: boolean;

  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedService,
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        params.getAll('code')
      )).subscribe((result: any) => {
        this.getCourse(result);
      });
    this.sharedService.isHandset$.subscribe(result => {
      this.isHandset = result;
    });
  }

  get sessions() { return this.form.controls.sessions as FormArray; }

  addSession() {
    const newSession = new FormGroup({
      venue: new FormControl('', [Validators.required]),
      repeatType: new FormControl('WEEKLY', [Validators.required]),
      repeatGap: new FormControl('1', [Validators.required, Validators.min(1)]),
      sessionType: new FormControl('LECTURE', [Validators.required]),
      date: new FormControl(new Date(), [Validators.required]),
      time: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required]),
    });
    this.sessions.push(newSession);
  }

  removeSession(i: number) {
    this.form.markAsDirty();
    this.sessions.removeAt(i);
  }

  getTimeString(start: Date, duration: number) {
    return new Date(start.valueOf() + duration * 60000).toTimeString().substr(0, 5);
  }

  getCourse(courseCode: string) {
    this.sharedService.getCourse(courseCode).subscribe((response: any) => {
      this.gotCourse = true;
      this.course = response.course;
      const sessions: Array<FormGroup> = [];
      this.course.sessions.forEach(session => {
        const date = new Date(session.nextDate);
        let dateStr;
        let timeStr;
        let endStr;
        if (date.toString() === 'Invalid Date') {
          dateStr = '';
          timeStr = '';
          endStr = '';
        } else {
          dateStr = date.toISOString();
          timeStr = date.toTimeString().substr(0, 5);
          endStr = this.getTimeString(date, session.duration);
        }
        const newSession = new FormGroup({
          venue: new FormControl(session.venue, [Validators.required]),
          repeatType: new FormControl(session.repeatType, [Validators.required]),
          repeatGap: new FormControl(session.repeatGap, [Validators.required]),
          sessionType: new FormControl(session.sessionType, [Validators.required]),
          date: new FormControl(dateStr, [Validators.required]),
          time: new FormControl(timeStr, [Validators.required]),
          endTime: new FormControl(endStr, [Validators.required]),
        });
        sessions.push(newSession);
      });
      this.form = new FormGroup({
        courseCode: new FormControl(this.course.courseCode),
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
    course.sessions.forEach((session: any) => {
      session.duration = this.timeBetween(session.time, session.endTime);
      delete session.endTime;
    });
    this.sharedService.updateCourse(course).subscribe((response: any) => {
      form.markAsPristine();
    });
  }

  // TODO: Move this to a utils file
  timeBetween(start: string, end: string) {
    const startH = parseInt(start.substr(0, 2), 10);
    const startM = parseInt(start.substr(3, 2), 10);
    const endH = parseInt(end.substr(0, 2), 10);
    const endM = parseInt(end.substr(3, 2), 10);

    let h = endH - startH;
    const m = endM - startM;
    if (endH < startH) {
      // We have crossed midnight
      h = (24 - startH) + endH;
    }
    return m + 60 * h;
  }

}
