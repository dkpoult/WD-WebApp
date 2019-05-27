import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared/shared.service';
import { TimetableService } from './timetable.service';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit {

  courses: Array<{
    courseCode: string,
    courseName: string,
    courseDescription: string,
    lecturer: string,
    hasPassword: boolean,
    questionForum: string,
    forums: Array<string>,
    sessions: Array<any>
  }>;

  sessions: Array<any>;

  gotCourses = false;

  constructor(
    private sharedService: SharedService,
    private timetableService: TimetableService
  ) { }

  ngOnInit() {
    this.getCourses();
  }

  getCourses() {
    this.sharedService.getCourses()
      .subscribe((response: any) => {
        if (response.responseCode.startsWith('failed')) {
          console.log(response);
          return;
        }
        const today = new Date();
        response.courses.forEach(course => {
          course.sessions.forEach(session => {
            session.date = new Date(session.nextDate);
            session.nextDate = this.timetableService.getNextDate(session);
          });
        });
        this.sessions = [];
        this.courses = response.courses;
        this.gotCourses = true;
        this.courses.forEach(course => {
          course.sessions.forEach(session => {
            session.courseCode = course.courseCode;
            this.sessions.push(session);
          });
        });
      });
  }

  sameWeek(session) {
    return this.timetableService.sameWeek(new Date(), session.nextDate);
  }

  urgentSession(session) {
    let urgent = session.sessionType === 'TEST';
    // urgent = urgent && this.sameWeek(session);
    return urgent;
  }

  getEndTime(session): Date {
    const date = session.nextDate as Date;
    date.setTime(date.valueOf() + session.minutes * 1000 * 3600);
    return date;
  }

}
