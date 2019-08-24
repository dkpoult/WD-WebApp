import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private darkMode: Subject<boolean> = new Subject<boolean>();
  isDarkMode$ = this.darkMode.asObservable();

  constructor() {
    this.darkMode.next(false);
  }

  setDarkMode(isDarkMode: boolean) {
    this.darkMode.next(isDarkMode);
  }
}
