import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavComponent } from './nav/nav.component';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { SignupDialogComponent } from './signup-dialog/signup-dialog.component';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { SharedService } from './shared/shared.service';
import { FeaturesComponent } from './features/features.component';
import { CoursesComponent } from './courses/courses.component';
import { MainComponent } from './main/main.component';
import { CreateCourseComponent } from './create-course/create-course.component';
import { LinkCourseComponent } from './link-course/link-course.component';
import { MaterialModule } from './shared/material.module';
import { SpeedDialFabComponent } from './speed-dial-fab/speed-dial-fab.component';
import { EnrolComponent } from './enrol/enrol.component';
import { ForumComponent } from './forum/forum.component';
import { ConfirmEnrolmentComponent } from './confirm-enrolment/confirm-enrolment.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { PostComponent } from './post/post.component';

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
    MainComponent,
    CreateCourseComponent,
    LinkCourseComponent,
    SpeedDialFabComponent,
    EnrolComponent,
    ForumComponent,
    ConfirmEnrolmentComponent,
    CreatePostComponent,
    PostComponent,
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
    MaterialModule
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
  // Add dialogs here
  entryComponents: [
    LoginDialogComponent,
    SignupDialogComponent,
    CreateCourseComponent,
    LinkCourseComponent,
    EnrolComponent,
    ConfirmEnrolmentComponent,
    CreatePostComponent
  ]
})
export class AppModule { }
