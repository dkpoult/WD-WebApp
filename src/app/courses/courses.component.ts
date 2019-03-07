import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared/shared.service';
import { CreateCourseComponent } from '../create-course/create-course.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { LinkCourseComponent } from '../link-course/link-course.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  createCourseDialogRef: MatDialogRef<CreateCourseComponent>;
  linkCourseDialogRef: MatDialogRef<LinkCourseComponent>;

  constructor(
    private sharedService: SharedService,
    private dialog: MatDialog) { }

  ngOnInit() {
  }

  openCreateCourseDialog() {
    this.createCourseDialogRef = this.dialog.open(CreateCourseComponent);
  }

  openLinkCourseDialog() {
    this.linkCourseDialogRef = this.dialog.open(LinkCourseComponent);
  }

}
