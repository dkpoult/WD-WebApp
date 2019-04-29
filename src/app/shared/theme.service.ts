import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private darkMode: Subject<boolean> = new Subject<boolean>();
  isDarkMode$ = this.darkMode.asObservable();

  constructor() {
    this.darkMode.next(true);
  }

  setDarkMode(isDarkMode: boolean) {
    this.darkMode.next(isDarkMode);
    document.getElementsByTagName('body')[0].classList.toggle('dark'); // TODO: Don't use this, figure out why the observable is not working
  }
}
