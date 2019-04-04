import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { SharedService } from '../shared/shared.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-create-comment',
  templateUrl: './create-comment.component.html',
  styleUrls: ['./create-comment.component.scss']
})
export class CreateCommentComponent implements OnInit {

  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<CreateCommentComponent>,
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      body: new FormControl('', [Validators.required])
    });
  }

  hasErrors() {
    return this.form.controls.body.invalid;
  }

  submit(form: FormGroup) {
    this.sharedService.makeComment(this.data, this.form.controls.body.value).subscribe((response: any) => {
      switch (response.responseCode) {
        case 'successful':
          this.dialogRef.close(response.comment);
          break;
        default:
          console.log(response);
          break;
      }
    });
  }
}
