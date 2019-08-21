import { PermissionService } from './../shared/permission.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../shared/shared.service';
import { CreateCourseComponent } from './create-course/create-course.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { LinkCourseComponent } from './link-course/link-course.component';
import { SpeedDialFabComponent } from '../speed-dial-fab/speed-dial-fab.component';
import { EnrolComponent } from '../courses/enrol/enrol.component';
import { EditCourseComponent } from '../courses/edit-course/edit-course.component';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { isNullOrUndefined } from 'util';
import { ViewCourseComponent } from './view-course/view-course.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  animations: [
    trigger('slideInOut',
      [
        transition(
          ':enter',
          [
            style({
              transform: 'translateX(-1000px)',
              opacity: 0,
              'box-shadow': '0 0 0 0 transparent'
            }),
            animate('.3s ease-out',
              style({
                transform: 'translateX(0px)',
                opacity: 1,
                'box-shadow': '*'
              }))
          ]
        ),
        transition(
          ':leave',
          [
            style({
              transform: 'translateX(0)',
              opacity: 1,
              'box-shadow': '*'
            }),
            animate('.3s ease-in',
              style({
                transform: 'translateX(-1000px)',
                opacity: 0,
                'box-shadow': '0 0 0 0 transparent'
              }))
          ]
        )
      ]
    ),
    trigger('growInOut',
      [
        transition(
          ':enter',
          [
            style({
              transform: 'scale(0)',
              opacity: 0,
            }),
            animate('.3s ease-out',
              style({
                transform: 'scale(1)',
                opacity: 1,
              }))
          ]
        ),
        transition(
          ':leave',
          [
            style({
              transform: 'scale(1)',
              opacity: 1,
            }),
            animate('.3s ease-in',
              style({
                transform: 'scale(0)',
                opacity: 0,
              }))
          ]
        )
      ]
    ),
    trigger('fadeInOut',
      [
        transition(
          ':enter',
          [
            style({ opacity: 0 }),
            animate('.3s ease-out',
              style({ opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ opacity: 1 }),
            animate('.3s ease-in',
              style({ opacity: 0 }))
          ]
        )
      ]
    ),
    trigger('spin',
      [
        transition('true <=> false', [
          animate(300, keyframes([
            style({ transform: 'rotate(0deg)' }),
            style({ transform: 'rotate(-180deg)' })
          ]))
        ])
      ]
    )
  ]
})
export class CoursesComponent implements OnInit {

  createCourseDialogRef: MatDialogRef<CreateCourseComponent>;
  linkCourseDialogRef: MatDialogRef<LinkCourseComponent>;
  enrolDialogRef: MatDialogRef<EnrolComponent>;
  editDialogRef: MatDialogRef<EditCourseComponent>;
  viewDetailsDialogRef: MatDialogRef<ViewCourseComponent>;

  get lectureOnly() { return this.toggleOptions[0].checked; }
  get tutorOnly() { return this.toggleOptions[1].checked; }
  searchTerm = '';
  spin = false;
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

  toggleOptions = [
    {
      hint: 'Lecturer',
      checked: false,
      icon: 'school',
      color: '#d51a1a'
    },
    {
      hint: 'Tutor',
      checked: false,
      icon: 'person',
      color: '#4ba5db'
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

  syncWithMoodle(courseCode: any, course: any) {
    this.sharedService.syncWithMoodle(courseCode).subscribe((response: any) => {
      course = response.course;
    });
    this.spin = !this.spin;
  }

  isMoodleCourse(course: any): boolean {
    return (!isNullOrUndefined(course.moodleId));
  }

  filter(value: any, lectureOnly?: boolean, tutorOnly?: boolean, searchTerm?: string) {
    searchTerm = searchTerm.toLowerCase();

    const name: string = value.courseName.toLowerCase();
    const code: string = value.courseCode.toLowerCase();
    const lecturer: boolean = this.isLecturer(value);
    const tutor: boolean = this.isTutor(value);

    const searchMatch = (name.includes(searchTerm) || code.includes(searchTerm));

    let pass = searchMatch;
    if (lectureOnly) { pass = pass && lecturer; }
    if (tutorOnly) { pass = pass && tutor; }

    return pass;
  }

  openDetailsDialog(course: any) {
    this.viewDetailsDialogRef = this.dialog.open(ViewCourseComponent, { data: course });
  }

  searchBarClick(searchBar: any, event: MouseEvent) {
    event.preventDefault();
    setTimeout(() => {
      // Delay the focus 100ms
      searchBar.focus();
    }, 100);
  }
}
