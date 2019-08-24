import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared/shared.service';
import { MakeAnnouncementComponent } from '../announcements/make-announcement/make-announcement.component';
import { switchMap } from 'rxjs/operators';
import { PermissionService } from '../shared/permission.service';
import { animate, trigger, transition, style } from '@angular/animations';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ opacity: 0 }),
            animate('.5s ease-out',
              style({ opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ opacity: 1 }),
            animate('.5s ease-in',
              style({ opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class AnnouncementsComponent implements OnInit {

  makeAnnouncementDialogRef: MatDialogRef<MakeAnnouncementComponent>;

  gotCourse = false;
  course: any;

  constructor(
    private sharedService: SharedService,
    private permissionService: PermissionService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        params.getAll('code')
      ))
      .subscribe((result: any) => {
        this.getCourse(result);
      });
  }

  canAnnounce() {
    if (!this.gotCourse) {
      return false;
    }
    return this.permissionService.hasPermission('ANNOUNCE', this.course.permissions);
  }

  getCourse(courseCode: string): any {
    this.sharedService.getCourse(courseCode).subscribe((response: any) => {
      if (response.responseCode.startsWith('failed')) {
        console.log(response.responseCode);
        return;
      }
      this.gotCourse = true;
      this.course = response.course;
    });
  }

  openMakeAnnouncementDialog() {
    this.makeAnnouncementDialogRef = this.dialog.open(MakeAnnouncementComponent, { data: this.course.courseCode });
    this.makeAnnouncementDialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getCourse(this.course.courseCode);
      }
    });
  }

}
