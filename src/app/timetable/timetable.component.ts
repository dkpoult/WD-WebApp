import {VenueService} from '../shared/services/venue.service';
import {Component, OnInit} from '@angular/core';
import {SharedService} from '../shared/services/shared.service';
import {TimetableService} from '../shared/services/timetable.service';
import {Router} from '@angular/router';
import {Course, Session, Venue} from '../shared/services/models';
import {UserService} from '../shared/services/user.service';

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

  selectedDate: Date;

  public getDateString = this.timetableService.getDateString;

  constructor(
    private sharedService: SharedService,
    private timetableService: TimetableService,
    private venueService: VenueService,
    private userService: UserService,
    private router: Router
  ) {
  }

  get selectedSessions() {
    const sessions = [];
    if (!!this.sessions) {
      return this.sessions.filter((session: any) => {
        return this.timetableService.sessionFallsOn(session, this.selectedDate);
      });
    }
    return sessions;
  }

  timetableClass = (date: Date) => {
    const classList: string[] = [];
    if (!this.sessions) {
      return;
    }
    this.sessions.forEach((session: any) => {
      if (date.valueOf() < this.timetableService.today.valueOf()) {
        classList.push('inPast');
      }
      if (this.timetableService.sessionFallsOn(session, date)) {
        const dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
                    .toISOString()
                    .split('T')[0];

        if (session.cancellations.includes(dateString)) {
          classList.push('cancelled');
        }
        classList.push('fallsOn');
        if (this.urgentSession(session)) {
          classList.push('urgent');
        }
      }
    });
    return classList.join(' ');
  };

  sessionCancelled(session, date: Date) {
    const dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
      .toISOString()
      .split('T')[0];
    if (session.cancellations.includes(dateString)) {
      return true;
    }
    return false;
  }

  log(object: any) {
    console.log(object);
  }

  ngOnInit() {
    this.newVenues$.subscribe((venues: Venue[]) => {
      this.venues = venues;
    });

    this.getCourses();
    this.venueService.refreshVenues();
  }

  bookingsFor(session: any) {
    const i = this.timetableService.repeatsSince(session.startDate, this.selectedDate, session.repeatType, session.repeatGap).toString();
    console.log(session);
    console.log(i);
    return session.bookings[i];
  }

  getSlotStartTime(session, i) {
    return this.timetableService.getSlotStartTime(session, i);
  }

  slotAllocated(bookings, i) {
    console.log(bookings, i);
    return bookings[i].allocated;
  }

  getCourses() {
    this.sharedService.getCourses()
      .subscribe((response: any) => {
        console.log(response);
        if (response.responseCode.startsWith('failed')) {
          console.log(response);
          return;
        }
        const today = new Date();
        response.courses.forEach(course => {
          course.sessions.forEach(session => {
            session.startDate = new Date(session.startDate);
            session.date = this.timetableService.getNextDate(session);
          });
          const bookableSessions = course.bookableSessions[this.userService.currentUser.personNumber];
          for (const s in bookableSessions) {
            if (bookableSessions.hasOwnProperty(s)) {
              const session = bookableSessions[s] as any;
              session.startDate = new Date(session.startDate);
              session.date = this.timetableService.getNextDate(session);
            }
          }
        });
        this.sessions = [];
        this.courses = response.courses;
        this.gotCourses = true;
        this.courses.forEach(course => {
          course.sessions.forEach(session => {
            session.courseCode = course.courseCode;
            this.sessions.push(session);
          });
          const bookableSessions = course.bookableSessions[this.userService.currentUser.personNumber];
          if (!!bookableSessions) {
            bookableSessions.forEach(session => {
              session.courseCode = course.courseCode;
              this.sessions.push(session);
            });
          }
        });
        this.changeSelected(new Date());
      });
  }

  sameWeek(session) {
    return this.timetableService.sameWeek(new Date(), session.date);
  }

  urgentSession(session) {
    // let urgent = session.sessionType === 'TEST';
    // urgent = urgent && this.sameWeek(session);
    return session.sessionType === 'TEST';
  }

  getEndTime(session): Date {
    const date = session.date as Date;
    date.setTime(date.valueOf() + session.minutes * 1000 * 3600);
    return date;
  }

  venueHasCoords(venue) {
    if (!this.venues) {
      return false;
    }
    const dbVenue = this.venues.find(v => v.buildingCode === venue.buildingCode);
    return !!dbVenue && !!dbVenue.coordinates;
  }

  showInMap(venue) {
    this.router.navigate(['map', venue.buildingCode]);
  }

  changeSelected(date: Date) {
    this.selectedDate = this.timetableService.zeroTime(date);
  }

}
