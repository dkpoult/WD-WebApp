import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SharedService } from '../../../shared/services/shared.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {

  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<CreatePostComponent>,
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      body: new FormControl('')
    });
  }

  hasErrors() {
    return (this.form.invalid);
  }

  submit(form: FormGroup) {
    const post = {
      forum: this.data,
      title: form.controls.title.value,
      body: form.controls.body.value
    };
    this.sharedService.makePost(post).subscribe((response: any) => {
      switch (response.responseCode) {
        case 'successful':
          this.dialogRef.close(true);
          break;
        default:
          this.form.markAsPristine();
          break;
      }
    });
  }

}
