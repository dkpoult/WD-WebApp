import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-update-details',
  templateUrl: './update-details.component.html',
  styleUrls: ['./update-details.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(300,
          style({ opacity: 1 })
        )
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate(300,
          style({ opacity: 0 })
        )
      ])
    ]),
  ]
})
export class UpdateDetailsComponent implements OnInit {

  form: FormGroup;

  @Input() course: any = {};
  @Output() submitCourse = new EventEmitter<any>();

  clearPassword: boolean;
  get password() { return this.form.controls.password; }

  constructor() { }

  ngOnInit() {
    this.form = new FormGroup({
      courseName: new FormControl(this.course.courseName, [Validators.required]),
      courseDescription: new FormControl(this.course.courseDescription),
      password: new FormControl(),
    });
  }

  setClearPassword(clear: boolean) {
    this.clearPassword = clear;
    clear ? this.password.disable() : this.password.enable();
  }

  canSubmit(): boolean {
    return (
      this.form.valid &&
      this.form.dirty
    );
  }

  submit() {
    const newDetails = this.form.value;
    if (this.clearPassword) {
      newDetails.password = '';
    }
    this.submitCourse.next(newDetails);
    this.form.markAsPristine();
    this.password.setValue(''); // Reset this to blank
    this.setClearPassword(false);
  }
}
