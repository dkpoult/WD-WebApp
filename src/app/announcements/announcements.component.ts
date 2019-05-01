import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared/shared.service';
import { MakeAnnouncementComponent } from '../make-announcement/make-announcement.component';
import { switchMap } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss']
})
export class AnnouncementsComponent implements OnInit {

  makeAnnouncementDialogRef: MatDialogRef<MakeAnnouncementComponent>;

  gotCourse = false;
  code: any;
  course: any;

  constructor(
    private sharedService: SharedService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private logger: NGXLogger
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        params.getAll('code')
      ))
      .subscribe((result: any) => {
        this.code = result;
        this.getCourse();
      });
  }

  isLecturer() {
    if (!this.gotCourse) {
      return false;
    }
    const lecturer = this.course.lecturer;
    return this.sharedService.currentUser.personNumber === lecturer;
  }

  getCourse(): any {
    this.sharedService.getCourse(this.code).subscribe((response: any) => {
      if (response.responseCode.startsWith('failed')) {
        this.logger.error(response.responseCode);
        return;
      }
      this.gotCourse = true;
      this.course = response.course;
    });
  }

  openMakeAnnouncementDialog() {
    this.makeAnnouncementDialogRef = this.dialog.open(MakeAnnouncementComponent, { data: this.code });
    this.makeAnnouncementDialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getCourse();
      }
    });
  }

}
