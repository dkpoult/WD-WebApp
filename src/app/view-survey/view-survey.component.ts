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

  constructor(
    private sharedService: SharedService,
    private surveyService: SurveyService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      answer: new FormControl('', [Validators.required])
    });
  }

  createSurvey() {
    if (isNullOrUndefined(this.course)) {
      return;
    }
    this.createSurveyDialogRef = this.dialog.open(CreateSurveyComponent, { data: this.course });
    this.createSurveyDialogRef.afterClosed().subscribe(survey => {
      if (!survey) { return; }
    });
  }

  closeSurvey() {
    this.sharedService.closeSurvey(this.course.courseCode).subscribe(console.log);
  }

  answerSurvey() {
    const answer = this.form.get('answer').value;
    this.sharedService.answerSurvey(this.course.courseCode, answer);
    this.form.markAsPristine();
  }

  isLecturer() {
    return this.course.lecturer.personNumber === this.sharedService.currentUser.personNumber;
  }

}
