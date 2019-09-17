import { MatDialog, MatDialogRef } from '@angular/material';
import { SurveyService } from '../../shared/services/survey.service';
import { SharedService } from '../../shared/services/shared.service';
import { Component, OnInit, Input } from '@angular/core';
import { CreateSurveyComponent } from './create-survey/create-survey.component';
import { isNullOrUndefined } from 'util';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PermissionService } from 'src/app/shared/services/permission.service';

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
    private permissionService: PermissionService,
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
  }

  closeSurvey() {
    this.sharedService.closeSurvey(this.course.courseCode).subscribe();
  }

  answerSurvey() {
    const answer = this.form.get('answer').value;
    this.sharedService.answerSurvey(this.course.courseCode, answer).subscribe();
    this.form.markAsPristine();
  }

  isLecturer() {
    return this.permissionService.isLecturer(this.course);
  }

}
