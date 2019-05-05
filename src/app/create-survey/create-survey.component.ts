import { SurveyService } from '../shared/survey.service';
import { FormGroup, FormControl, FormArray, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SharedService } from '../shared/shared.service';


export function requiredIf(condition: boolean): ValidatorFn {
  // TODO:
  return null;
}

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
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      responseType: new FormControl('', [Validators.required]),
      options: new FormArray([]) // TODO: Make this initialise to 2 empty options
    });
  }

  hasErrors() {
    return (
      (this.form.invalid) ||
      (this.surveyService.surveyIsActive(this.data.courseCode) && this.form.pristine)
    );
  }

  get options(): FormArray { return this.form.get('options') as FormArray; }

  addOption() {
    this.options.push(new FormControl('', [Validators.required]));
  }

  removeOption(i: number) {
    this.options.removeAt(i);
  }

  submit(form) {
    const survey = form.value;
    if (survey.responseType !== 'MC') {
      survey.options = [];
    }
    console.log(survey);
    this.sharedService.makeSurvey(this.data.courseCode, survey).subscribe((response: any) => {
      switch (response.responseCode) {
        case 'successful':
          this.dialogRef.close(survey);
          break;
        default:
          console.log(response);
          this.form.markAsPristine();
          break;
      }
    });
  }

}
