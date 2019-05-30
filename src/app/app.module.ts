import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StompRService } from '@stomp/ng2-stompjs';
import { AgmCoreModule } from '@agm/core';
import { NavComponent } from './nav/nav.component';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { SignupDialogComponent } from './signup-dialog/signup-dialog.component';
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
import { CommentComponent } from './post/comment/comment.component';
import { PostActionButtonsComponent } from './post/post-action-buttons/post-action-buttons.component';
import { CreateCommentComponent } from './post/create-comment/create-comment.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { MakeAnnouncementComponent } from './make-announcement/make-announcement.component';
import { EditCourseComponent } from './edit-course/edit-course.component';
import { TimetableComponent } from './timetable/timetable.component';
import { EditSessionComponent } from './edit-course/edit-session/edit-session.component';
import { ChatComponent } from './chat/chat.component';
import { ChatMessageComponent } from './chat/chat-message/chat-message.component';
import { ViewSurveyComponent } from './view-survey/view-survey.component';
import { CreateSurveyComponent } from './create-survey/create-survey.component';
import { ChartComponent } from './chart/chart.component';
import { CalendarComponent } from './timetable/calendar/calendar.component';
import { VenueInputComponent } from './edit-course/edit-session/venue-input/venue-input.component';
import { MapComponent } from './map/map.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

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
    CommentComponent,
    PostActionButtonsComponent,
    CreateCommentComponent,
    AnnouncementsComponent,
    MakeAnnouncementComponent,
    EditCourseComponent,
    TimetableComponent,
    EditSessionComponent,
    ChatComponent,
    ChatMessageComponent,
    ViewSurveyComponent,
    CreateSurveyComponent,
    ChartComponent,
    CalendarComponent,
    VenueInputComponent,
    MapComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    HttpClientModule,
    FlexLayoutModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCygSmaQH2Ms5ja7cyF2gGfSMA93l5bnPs'
    })
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initialiseApp,
      deps: [SharedService],
      multi: true
    },
    StompRService
  ],
  bootstrap: [AppComponent],
  // * Add dialogs here
  entryComponents: [
    LoginDialogComponent,
    SignupDialogComponent,
    CreateCourseComponent,
    LinkCourseComponent,
    EnrolComponent,
    ConfirmEnrolmentComponent,
    CreatePostComponent,
    CreateCommentComponent,
    MakeAnnouncementComponent,
    CreateSurveyComponent,
    ConfirmDialogComponent,
  ]
})
export class AppModule { }
