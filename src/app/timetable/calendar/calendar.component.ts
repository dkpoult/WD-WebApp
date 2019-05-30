import { Component, OnInit, Input } from '@angular/core';
import { TimetableService } from 'src/app/shared/timetable.service';

enum CalendarScale {
  Year = 'Year',
  Month = 'Month',
  Week = 'Week',
  Day = 'Day'
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  @Input() scale: CalendarScale;

  @Input() sessions: Array<any>;

  constructor(private timetableService: TimetableService) { }

  ngOnInit() {
  }

  calcNumTiles() {
    switch (this.scale) {
      case 'Year':
        return 12;
      case 'Month':
        const today = new Date();
        return this.timetableService.daysInMonth(today.getFullYear(), today.getMonth());
      case 'Week':
        return 7;
      case 'Day':
        return 24;
    }
  }

  calcNumCols() {
    switch (this.scale) {
      case 'Year':
        return 4; // 4x3 Months
      case 'Month':
        return 7; // 7x4ish Days
      case 'Week':
        return 7; // 7 days
      case 'Day':
        return 24; // 24 hours
    }
  }

  calcNumRows() {
    const tiles = this.calcNumTiles();
    const cols = this.calcNumCols();
    return Math.floor(tiles / cols) + (tiles % cols > 0 ? 1 : 0);
  }
}
