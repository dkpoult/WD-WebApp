import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared/shared.service';
import { TimetableService } from '../shared/timetable.service';

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
    sessions: Array<{
      venue: string,
      repeatType: string, // [DAILY, WEEKLY, MONTHLY, ONCE]
      repeatGap: number,
      date: Date, // "nextDate" in the response
      nextDate: Date, // not in the response
      sessionType: string, // [LECTURE, LAB, TUTORIAL, TEST, OTHER]
      duration: number
    }>
  }>;

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
        this.courses = response.courses;
        this.gotCourses = true;
      });
  }

  sameWeek(session) {
    return this.timetableService.sameWeek(new Date(), session.nextDate);
  }

  getEndTime(session): Date {
    const date = session.nextDate as Date;
    date.setTime(date.valueOf() + session.minutes * 1000 * 3600);
    return date;
  }
}
