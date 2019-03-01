import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatTooltipModule
} from '@angular/material';
import { NavComponent } from './nav/nav.component';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { SignupDialogComponent } from './signup-dialog/signup-dialog.component';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { SharedService } from './shared/shared.service';
import { FeaturesComponent } from './features/features.component';
import { CoursesComponent } from './courses/courses.component';

export function initialiseApp(config: SharedService) {
  return () => config.initialise();
}
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LoginDialogComponent,
    SignupDialogComponent,
    FeaturesComponent,
    CoursesComponent,
  ],
  imports: [
    HttpClientModule,
    FlexLayoutModule,
    LoggerModule.forRoot({ level: NgxLoggerLevel.TRACE }),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initialiseApp,
      deps: [SharedService],
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [LoginDialogComponent, SignupDialogComponent]
})
export class AppModule { }
