import { VenueService } from '../shared/venue.service';
import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared/services/shared.service';
import { TimetableService } from '../shared/services/timetable.service';
import { Router } from '@angular/router';
import { Course, Session, Venue } from '../shared/services/models';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit {

  courses: Course[];

  sessions: Session[];

  gotCourses = false;

  venues: Venue[];
  newVenues$ = this.venueService.newVenues$;

  constructor(
    private sharedService: SharedService,
    private timetableService: TimetableService,
    private venueService: VenueService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.newVenues$.subscribe((venues: Venue[]) => {
      this.venues = venues;
    });

    this.getCourses();
    this.venueService.updateVenues();
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
            session.date = new Date(session.startDate);
            session.startDate = this.timetableService.getNextDate(session);
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
    return this.timetableService.sameWeek(new Date(), session.startDate);
  }

  urgentSession(session) {
    // let urgent = session.sessionType === 'TEST';
    // urgent = urgent && this.sameWeek(session);
    return session.sessionType === 'TEST';
  }

  getEndTime(session): Date {
    const date = session.startDate as Date;
    date.setTime(date.valueOf() + session.minutes * 1000 * 3600);
    return date;
  }

  venueHasCoords(venue) {
    if (!this.venues) { return false; }
    const dbVenue = this.venues.find(v => v.buildingCode === venue.buildingCode);
    return !!dbVenue && !!dbVenue.coordinates;
  }

  showInMap(venue) {
    this.router.navigate(['map', venue.buildingCode]);
  }

}
