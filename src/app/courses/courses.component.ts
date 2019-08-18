import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../shared/shared.service';
import { CreateCourseComponent } from './create-course/create-course.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { LinkCourseComponent } from './link-course/link-course.component';
import { SpeedDialFabComponent } from '../speed-dial-fab/speed-dial-fab.component';
import { EnrolComponent } from '../courses/enrol/enrol.component';
import { EditCourseComponent } from '../courses/edit-course/edit-course.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  createCourseDialogRef: MatDialogRef<CreateCourseComponent>;
  linkCourseDialogRef: MatDialogRef<LinkCourseComponent>;
  enrolDialogRef: MatDialogRef<EnrolComponent>;
  editDialogRef: MatDialogRef<EditCourseComponent>;

  courses: Array<any>;
  gotCourses = false;

  @ViewChild('fab') fab: SpeedDialFabComponent;
  fabActions = [
    {
      icon: 'class',
      text: 'Enrol In A Course',
      event: 'enrolDialog'
    },
    {
      icon: 'insert_link',
      text: 'Link Moodle Course',
      event: 'linkCourseDialog'
    },
    {
      icon: 'add',
      text: 'Create New Course',
      event: 'createCourseDialog'
    }
  ];

  constructor(
    private sharedService: SharedService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getCourses();
  }

  openEnrolDialog() {
    this.enrolDialogRef = this.dialog.open(EnrolComponent);
    this.enrolDialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getCourses();
      }
    });
  }

  openCreateCourseDialog() {
    this.createCourseDialogRef = this.dialog.open(CreateCourseComponent);
    this.createCourseDialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getCourses();
      }
    });
  }

  openLinkCourseDialog() {
    this.linkCourseDialogRef = this.dialog.open(LinkCourseComponent);
    this.linkCourseDialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getCourses();
      }
    });
  }

  getCourses() {
    this.sharedService.getCourses()
      .subscribe((response: any) => {
        if (response.responseCode.startsWith('failed')) {
          console.log(response);
          return;
        }
        this.courses = response.courses;
        this.gotCourses = true;
      });
  }

  isLecturer(course) {
    return this.sharedService.currentUser.personNumber === course.lecturer.personNumber;
  }

  doAction(action: string) {
    switch (action) {
      case 'createCourseDialog':
        this.openCreateCourseDialog();
        break;
      case 'linkCourseDialog':
        this.openLinkCourseDialog();
        break;
      case 'enrolDialog':
        this.openEnrolDialog();
        break;
      default:
        break;
    }
  }
}
