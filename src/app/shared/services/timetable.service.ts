import {Injectable} from '@angular/core';
import {Session} from './models';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {

  constructor() {
  }

  get today() {
    const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }

  get minutesToMillis() {
    return 60000;
  }

  zeroTime(date: Date) {
    date = new Date(date);
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(0);
    return date;
  }

  getDateString(date) {
    const year = date.getFullYear().toString();
    // Month is 0 based for whatever reason
    let month = (date.getMonth() + 1).toString();
    if (month.length < 2) {
      month = '0' + month;
    }
    let day = date.getDate().toString();
    if (day.length < 2) {
      day = '0' + day;
    }
    return `${year}-${month}-${day}`;
  }

  diffDays(start: Date, end: Date) {
    const diffMs = end.valueOf() - start.valueOf();
    return diffMs / (86400000); // 86 400 000 = 1000 * 3600 * 24 = msToSec * secToHour * hourToDay
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

  getSlotStartTime(session, i: number) {
    const duration = session.duration / session.slotCount;
    console.log(session.startDate);
    const time = new Date(session.startDate).getTime();
    const t = new Date(time + duration * this.minutesToMillis * i);
    const hours = t.getHours();
    const minutes = t.getMinutes();
    return `${hours.toString(10).padStart(2, '0')}:${minutes.toString(10).padStart(2, '0')}`;
  }

  getSlotEndTime(session, i: number) {
    const duration = session.duration / session.slotCount;
    const time = new Date(session.startDate).getTime();
    const t = new Date(time
      + duration * this.minutesToMillis * (i + 1)
      - session.slotGap * this.minutesToMillis);
    const hours = t.getHours();
    const minutes = t.getMinutes();
    return `${hours.toString(10).padStart(2, '0')}:${minutes.toString(10).padStart(2, '0')}`;
  }

  getSlotDuration(session) {
    return (session.duration / session.slotCount) * this.minutesToMillis
      - session.slotGap * this.minutesToMillis;
  }

  inPast(session, date: Date): boolean {
    const startDate: Date = new Date(session.startDate);
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
    const startDate: Date = new Date(session.startDate);
    // Don't include times
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);

    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
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

  repeatsSince(startDate: Date, endDate: Date, repeatType: string, repeatGap: number) {
    const date = new Date(startDate);
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(0);
    if (repeatType === 'ONCE') {
      return 0;
    } else if (repeatType === 'MONTHLY') {
      let c = 0;
      while (date.valueOf() < endDate.valueOf()) {
        console.log(c, date);
        date.setMonth(date.getMonth() + repeatGap);
        c++;
      }
      return c;
    }
    if (repeatType === 'WEEKLY') {
      repeatGap *= 7;
    }
    const diff = this.diffDays(date, endDate);
    return Math.floor(diff / repeatGap);
  }

  getEndTimeString(start: Date, duration: number) {
    return new Date(start.valueOf() + duration * 60000).toTimeString().substr(0, 5);
  }

  timeBetween(start: string, end: string) {
    const startH = parseInt(start.substr(0, 2), 10);
    const startM = parseInt(start.substr(3, 2), 10);
    const endH = parseInt(end.substr(0, 2), 10);
    const endM = parseInt(end.substr(3, 2), 10);

    let h = endH - startH;
    const m = endM - startM;
    if (endH < startH) {
      // We have crossed midnight
      h = (24 - startH) + endH;
    }
    console.log(`${start} - ${end} = ${m + 60 * h} minutes`);
    return m + 60 * h;
  }

  getNextDate(session: Session) {
    session.startDate = new Date(session.startDate);
    const year = session.startDate.getFullYear();
    const month = session.startDate.getMonth();
    const day = session.startDate.getDate();
    let diff: number;
    let date: Date;
    let newDay;
    switch (session.repeatType) {
      case 'ONCE':
        date = new Date(session.startDate);
        break;
      case 'DAILY':
        diff = this.diffDays(session.startDate, new Date());
        newDay = day + Math.ceil(diff / session.repeatGap) * session.repeatGap;
        date = new Date(year, month, newDay);
        break;
      case 'WEEKLY':
        diff = this.diffWeeks(session.startDate, new Date());
        newDay = day + 7 * (Math.ceil(diff / session.repeatGap) * session.repeatGap);
        date = new Date(year, month, newDay);
        break;
      case 'MONTHLY':
        diff = this.diffMonths(session.startDate, new Date());
        const newMonth = month + Math.ceil(diff / session.repeatGap) * session.repeatGap;
        date = new Date(year, newMonth, Math.min(day, this.daysInMonth(year, newMonth)));
        break;
    }

    date.setHours(session.startDate.getHours());
    date.setMinutes(session.startDate.getMinutes());
    return date;
  }
}
