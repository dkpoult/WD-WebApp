import { MatDialog, MatDialogRef } from '@angular/material';
import { SurveyService } from './../shared/survey.service';
import { Component, OnInit, Input } from '@angular/core';
import { CreateSurveyComponent } from '../create-survey/create-survey.component';
import { SharedService } from '../shared/shared.service';
import { isNullOrUndefined } from 'util';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-view-survey',
  templateUrl: './view-survey.component.html',
  styleUrls: ['./view-survey.component.scss']
})
export class ViewSurveyComponent implements OnInit {

  @Input() course: any;
  @Input() survey: any;

  form: FormGroup;

  createSurveyDialogRef: MatDialogRef<CreateSurveyComponent>;

  data: number[] = [1, 0];

  pollingInterval: 2000;

  constructor(
    private sharedService: SharedService,
    private surveyService: SurveyService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      answer: new FormControl('', [Validators.required])
    });
    if (this.isLecturer) {
      // poll

    }
  }

  createSurvey() {
    if (isNullOrUndefined(this.course)) {
      return;
    }
    this.createSurveyDialogRef = this.dialog.open(CreateSurveyComponent, { data: this.course });
  }

  closeSurvey() {
    this.sharedService.closeSurvey(this.course.courseCode).subscribe(console.log);
  }

  answerSurvey() {
    const answer = this.form.get('answer').value;
    this.sharedService.answerSurvey(this.course.courseCode, answer).subscribe(console.log);
    this.form.markAsPristine();
  }

  isLecturer() {
    return this.course.lecturer.personNumber === this.sharedService.currentUser.personNumber;
  }

}
