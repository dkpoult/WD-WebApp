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

  msToRepeatType(type) {
    const msToDay = 86400000;
    switch (type) {
      case 'DAILY':
        return msToDay;
      case 'WEEKLY':
        return msToDay * 7;
      default:
        throw new Error('Only DAILY and WEEKLY are fixed length');
    }
  }

  inPast(session, date: Date): boolean {
    const startDate: Date = new Date(session.date);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // Don't include times
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setMilliseconds(0);

    yesterday.setHours(0);
    yesterday.setMinutes(0);
    yesterday.setMilliseconds(0);

    date.setHours(0);
    date.setMinutes(0);
    date.setMilliseconds(0);

    if (date.valueOf() >= yesterday.valueOf()) {
      return false;
    }
    return true;
  }

  sessionFallsOn(session, date: Date): boolean {
    const startDate: Date = new Date(session.date);

    // Don't include times
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setMilliseconds(0);

    date.setHours(0);
    date.setMinutes(0);
    date.setMilliseconds(0);

    if (date.valueOf() === startDate.valueOf()) {
      return true;
    }
    if (session.repeatType === 'ONCE') {
      return false;
    }
    if (session.repeatType === 'MONTHLY') {
      const currentDate = startDate;
      while (currentDate.valueOf() < date.valueOf()) {
        currentDate.setMonth(currentDate.getMonth() + session.repeatGap);
      }
      return currentDate.valueOf() === date.valueOf();
    }
    let ms = startDate.valueOf();
    while (ms < date.valueOf()) {
      ms += session.repeatGap * this.msToRepeatType(session.repeatType);
    }
    return ms === date.valueOf();
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
