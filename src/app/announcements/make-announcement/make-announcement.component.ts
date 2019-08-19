import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-make-announcement',
  templateUrl: './make-announcement.component.html',
  styleUrls: ['./make-announcement.component.scss']
})
export class MakeAnnouncementComponent implements OnInit {

  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<MakeAnnouncementComponent>,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      body: new FormControl('', [Validators.required])
    });
  }

  hasErrors() {
    return (this.form.invalid);
  }

  submit(form: FormGroup) {
    this.sharedService.makeAnnouncement(this.data, {
      title: this.form.controls.title.value,
      body: this.form.controls.body.value
    })
      .subscribe((response: any) => {
        switch (response.responseCode) {
          case 'successful':
            this.dialogRef.close(true);
            break;
          default:
            console.log(response);
            break;
        }
      });
  }
}
