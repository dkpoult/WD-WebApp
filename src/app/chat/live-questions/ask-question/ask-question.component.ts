import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.scss']
})
export class AskQuestionComponent implements OnInit {

  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AskQuestionComponent>
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      question: new FormControl('', [Validators.required])
    });
  }

  hasErrors() {
    return (this.form.invalid);
  }

  submit(form: FormGroup) {
    this.dialogRef.close(form.value.question);
  }
}
