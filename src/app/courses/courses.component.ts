import { PermissionService } from './../shared/permission.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../shared/shared.service';
import { CreateCourseComponent } from './create-course/create-course.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { LinkCourseComponent } from './link-course/link-course.component';
import { SpeedDialFabComponent } from '../speed-dial-fab/speed-dial-fab.component';
import { EnrolComponent } from '../courses/enrol/enrol.component';
import { EditCourseComponent } from '../courses/edit-course/edit-course.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ height: 0, opacity: 0 }),
            animate('.3s ease-out',
              style({ height: 300, opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ height: 300, opacity: 1 }),
            animate('.3s ease-in',
              style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class CoursesComponent implements OnInit {

  createCourseDialogRef: MatDialogRef<CreateCourseComponent>;
  linkCourseDialogRef: MatDialogRef<LinkCourseComponent>;
  enrolDialogRef: MatDialogRef<EnrolComponent>;
  editDialogRef: MatDialogRef<EditCourseComponent>;

  lectureOnly = false;
  tutorOnly = false;
  searchTerm = '';

  courses: Array<any>;
  get filteredCourses() {
    return this.courses.filter((value) =>
      this.filter(value, this.lectureOnly, this.tutorOnly, this.searchTerm));
  }
  gotCourses = false;


  @ViewChild('fab') fab: SpeedDialFabComponent;
  fabActions = [
    {
      icon: 'class',
      text: 'Enrol In A Course',
      event: 'enrol'
    },
    {
      icon: 'insert_link',
      text: 'Link Moodle Course',
      event: 'link'
    },
    {
      icon: 'add',
      text: 'Create New Course',
      event: 'create'
    }
  ];

  constructor(
    private sharedService: SharedService,
    private permissionService: PermissionService,
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
    return this.permissionService.isLecturer(course);
  }

  isTutor(course) {
    return this.permissionService.isTutor(course) && !this.isLecturer(course);
  }

  doAction(action: string) {
    switch (action) {
      case 'create':
        this.openCreateCourseDialog();
        break;
      case 'link':
        this.openLinkCourseDialog();
        break;
      case 'enrol':
        this.openEnrolDialog();
        break;
      default:
        break;
    }
  }

  filter(value: any, lectureOnly?: boolean, tutorOnly?: boolean, searchTerm?: string) {
    searchTerm = searchTerm.toLowerCase();

    const name = value.courseName.toLowerCase();
    const code = value.courseCode.toLowerCase();
    const lecturer = this.isLecturer(value);
    const tutor = this.isTutor(value);

    const searchMatch = (name.startsWith(searchTerm) || code.startsWith(searchTerm));

    let pass = searchMatch;
    if (lectureOnly) { pass = pass && lecturer; }
    if (tutorOnly) { pass = pass && tutor; }

    return pass;
  }
}
