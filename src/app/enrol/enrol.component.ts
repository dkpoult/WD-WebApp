import { SharedService } from './../shared/shared.service';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { ConfirmEnrolmentComponent } from '../confirm-enrolment/confirm-enrolment.component';

@Component({
  selector: 'app-enrol',
  templateUrl: './enrol.component.html',
  styleUrls: ['./enrol.component.scss']
})
export class EnrolComponent implements OnInit {

  confirmDialogRef: MatDialogRef<ConfirmEnrolmentComponent>;

  courses: Array<any>;
  gotCourses = false;

  constructor(
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<EnrolComponent>,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getCourses();
  }

  getCourses() {
    this.sharedService.getAvailableCourses()
      .subscribe((response: any) => {
        if (response.responseCode.startsWith('failed')) {
          return;
        }
        this.courses = response.courses;
        this.gotCourses = true;
      });
  }

  openConfirmDialog(course) {
    this.confirmDialogRef = this.dialog.open(ConfirmEnrolmentComponent, {
      data: {
        code: course.courseCode,
        password: course.hasPassword
      }
    });
    this.confirmDialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.dialogRef.close(true);
      }
    });
  }
}
