import {Component, OnInit} from '@angular/core';
import {switchMap} from 'rxjs/operators';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {SharedService} from '../shared/services/shared.service';
import {Course} from '../shared/services/models';
import {PermissionService} from '../shared/services/permission.service';
import {BookingsService} from '../shared/services/bookings.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit {

  courseCode: string;
  course: Course;

  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private bookingsService: BookingsService,
    private permissionsService: PermissionService,
  ) {
  }

  get isLecturer() {
    return !!this.course && this.permissionsService.isLecturer(this.course.permissions);
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        params.getAll('code')
      )).subscribe((result: any) => {
      this.courseCode = result;
      this.getCourse();
    });
  }

  getCourse() {
    this.sharedService.getCourse(this.courseCode).subscribe((result: any) => {
      if (result.responseCode === 'successful') {
        this.course = result.course;
      }
    });
  }

  // Update bookings for lecturer
  updateSessions(sessions: any) {
  }

  bookSlot(booking: any) {
    this.bookingsService.makeBooking(this.courseCode, booking).subscribe((result) => { console.log(result); this.getCourse(); });
  }

}
