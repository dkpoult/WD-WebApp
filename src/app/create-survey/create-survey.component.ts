import { SurveyService } from './../chat/survey.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.scss']
})
export class CreateSurveyComponent implements OnInit {

  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedService: SharedService,
    private surveyService: SurveyService,
    private dialogRef: MatDialogRef<CreateSurveyComponent>,
  ) { }

  ngOnInit() {

  }

  hasErrors() {
    return (
      (this.form.invalid) ||
      (this.surveyService.surveyIsActive(this.data.courseCode) && this.form.pristine)
    );
  }

  submit(form) {
    const survey = form.value;
    this.sharedService.makeSurvey(this.data.courseCode, survey).subscribe((response: any) => {
      switch (response.responseCode) {
        case 'successful':
          this.dialogRef.close(true);
          break;
        default:
          console.log(response);
          this.form.markAsPristine();
          break;
      }
    });
  }

}
