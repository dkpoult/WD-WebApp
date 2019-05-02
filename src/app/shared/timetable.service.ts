import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {

  constructor() { }

  diffDays(start: Date, end: Date) {
    const diffMs = end.valueOf() - start.valueOf();
    return diffMs / (86400000); // 86 400 000 = 1000 * 3600 * 24 = mstoSec * secToHour * hourToDay
  }

  sameWeek(a: Date, b: Date) {
    return Math.abs(this.diffDays(a, b)) < 7; // ! Not true
  }

  diffWeeks(start: Date, end: Date) {
    const days = this.diffDays(start, end);
    return days / 7;
  }

  diffMonths(start: Date, end: Date) {
    // The 1st is 1 month away from the 2nd, not one day
    if (end.getMonth() === start.getMonth() && end.getDate() > start.getDate()) {
      return 1;
    }
    return end.getMonth() - start.getMonth() + (12 * (end.getFullYear() - start.getFullYear()));
  }

  daysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
  }

  getNextDate(session) {
    const year = session.date.getFullYear();
    const month = session.date.getMonth();
    const day = session.date.getDate();

    let diff: number;
    let date: Date;
    switch (session.repeatType) {
      case 'ONCE':
        date = session.date;
        break;
      case 'DAILY':
        diff = this.diffDays(session.date, new Date());
        let newDay = day + Math.ceil(diff / session.repeatGap) * session.repeatGap;
        date = new Date(year, month, newDay);
        break;
      case 'WEEKLY':
        diff = this.diffWeeks(session.date, new Date());
        newDay = day + 7 * (Math.ceil(diff / session.repeatGap) * session.repeatGap);
        date = new Date(year, month, newDay);
        break;
      case 'MONTHLY':
        diff = this.diffMonths(session.date, new Date());
        const newMonth = month + Math.ceil(diff / session.repeatGap) * session.repeatGap;
        date = new Date(year, newMonth, Math.min(day, this.daysInMonth(year, newMonth)));
        break;
    }

    date.setHours(session.date.getHours());
    date.setMinutes(session.date.getMinutes());
    return date;
  }
}
