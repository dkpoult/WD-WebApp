import { Component, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'wd-web';

  @HostBinding('class.dark')
  darkMode: boolean;

  darkModeSubscription: Subscription;

  constructor(private theme: ThemeService) { }

  ngOnInit(): void {
    this.darkModeSubscription = this.theme.isDarkMode$.subscribe(val => {
      this.darkMode = val;
    });
  }

  ngOnDestroy(): void {
    if (this.darkModeSubscription) {
      this.darkModeSubscription.unsubscribe();
    }
  }
}
