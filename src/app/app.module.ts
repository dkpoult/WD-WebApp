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
import { CreateCourseComponent } from './courses/create-course/create-course.component';
import { LinkCourseComponent } from './courses/link-course/link-course.component';
import { MaterialModule } from './shared/material.module';
import { SpeedDialFabComponent } from './speed-dial-fab/speed-dial-fab.component';
import { EnrolComponent } from './courses/enrol/enrol.component';
import { ForumComponent } from './forum/forum.component';
import { ConfirmEnrolmentComponent } from './courses/enrol/confirm-enrolment/confirm-enrolment.component';
import { CreatePostComponent } from './post/create-post/create-post.component';
import { PostComponent } from './post/post.component';
import { CommentComponent } from './post/comment/comment.component';
import { PostActionButtonsComponent } from './post/post-action-buttons/post-action-buttons.component';
import { CreateCommentComponent } from './post/create-comment/create-comment.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { MakeAnnouncementComponent } from './announcements/make-announcement/make-announcement.component';
import { EditCourseComponent } from './courses/edit-course/edit-course.component';
import { TimetableComponent } from './timetable/timetable.component';
import { EditSessionComponent } from './courses/edit-course/edit-session/edit-session.component';
import { ChatComponent } from './chat/chat.component';
import { ChatMessageComponent } from './chat/chat-message/chat-message.component';
import { ViewSurveyComponent } from './chat/view-survey/view-survey.component';
import { CreateSurveyComponent } from './chat/view-survey/create-survey/create-survey.component';
import { ChartComponent } from './chat/view-survey/chart/chart.component';
import { CalendarComponent } from './timetable/calendar/calendar.component';
import { VenueInputComponent } from './courses/edit-course/edit-session/venue-input/venue-input.component';
import { MapComponent } from './map/map.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { LiveQuestionsComponent } from './chat/live-questions/live-questions.component';
import { AskQuestionComponent } from './chat/live-questions/ask-question/ask-question.component';
import { ViewCourseComponent } from './courses/view-course/view-course.component';

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
    LiveQuestionsComponent,
    AskQuestionComponent,
    ViewCourseComponent,
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
    AskQuestionComponent,
    ViewCourseComponent
  ]
})
export class AppModule { }
