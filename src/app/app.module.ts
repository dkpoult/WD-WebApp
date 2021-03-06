import {UpdatePermissionsComponent} from './courses/update-course/update-permissions/update-permissions.component';
import {UpdateSessionsComponent} from './courses/update-course/update-sessions/update-sessions.component';
import {UpdateDetailsComponent} from './courses/update-course/update-details/update-details.component';
import {UpdateCourseComponent} from './courses/update-course/update-course.component';
import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LayoutModule} from '@angular/cdk/layout';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StompRService} from '@stomp/ng2-stompjs';
import {AgmCoreModule} from '@agm/core';
import {NavComponent} from './nav/nav.component';
import {LoginDialogComponent} from './login-dialog/login-dialog.component';
import {SignupDialogComponent} from './signup-dialog/signup-dialog.component';
import {SharedService} from './shared/services/shared.service';
import {FeaturesComponent} from './features/features.component';
import {CoursesComponent} from './courses/courses.component';
import {MainComponent} from './main/main.component';
import {CreateCourseComponent} from './courses/create-course/create-course.component';
import {LinkCourseComponent} from './courses/link-course/link-course.component';
import {MaterialModule} from './shared/material.module';
import {SpeedDialFabComponent} from './speed-dial-fab/speed-dial-fab.component';
import {EnrolComponent} from './courses/enrol/enrol.component';
import {ForumComponent} from './forum/forum.component';
import {ConfirmEnrolmentComponent} from './courses/enrol/confirm-enrolment/confirm-enrolment.component';
import {CreatePostComponent} from './forum/post/create-post/create-post.component';
import {PostComponent} from './forum/post/post.component';
import {CommentComponent} from './forum/post/comment/comment.component';
import {PostActionButtonsComponent} from './forum/post/post-action-buttons/post-action-buttons.component';
import {CreateCommentComponent} from './forum/post/create-comment/create-comment.component';
import {AnnouncementsComponent} from './announcements/announcements.component';
import {MakeAnnouncementComponent} from './announcements/make-announcement/make-announcement.component';
import {TimetableComponent} from './timetable/timetable.component';
import {ChatComponent} from './chat/chat.component';
import {ChatMessageComponent} from './chat/chat-message/chat-message.component';
import {ViewSurveyComponent} from './chat/view-survey/view-survey.component';
import {CreateSurveyComponent} from './chat/view-survey/create-survey/create-survey.component';
import {ChartComponent} from './chat/view-survey/chart/chart.component';
import {SessionFormComponent} from './courses/update-course/update-sessions/session-form/session-form.component';
import {VenueInputComponent} from './courses/update-course/update-sessions/session-form/venue-input/venue-input.component';
import {MapComponent} from './map/map.component';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {LiveQuestionsComponent} from './chat/live-questions/live-questions.component';
import {AskQuestionComponent} from './chat/live-questions/ask-question/ask-question.component';
import {ViewCourseComponent} from './courses/view-course/view-course.component';
import {SearchBarComponent} from './widgets/search-bar/search-bar.component';
import {IfChangesDirective} from './shared/directives.module';
import {ViewUserComponent} from './user/view-user/view-user.component';
import {MarkdownPipe} from './markdown.pipe';
import {LoginComponent} from './main/login/login.component';
import {MakeBookingComponent} from './bookings/make-booking/make-booking.component';
import {ViewBookingsComponent} from './bookings/view-bookings/view-bookings.component';
import {BookingsComponent} from './bookings/bookings.component';
import {BookableSessionFormComponent} from './bookings/view-bookings/bookable-session-form/bookable-session-form.component';
import {AdminPanelComponent} from './admin-panel/admin-panel.component';
import {VenuesComponent} from './admin-panel/venues/venues.component';
import {ViewBuildingComponent} from './admin-panel/venues/view-building/view-building.component';
import {NewBuildingComponent} from './admin-panel/venues/new-building/new-building.component';
import {FilterPipe} from './filter.pipe';
import {EventsComponent} from './admin-panel/events/events.component';
import {ViewEventComponent} from './admin-panel/events/view-event/view-event.component';
import { ViewFloorComponent } from './admin-panel/venues/view-floor/view-floor.component';
import { EditFlowComponent } from './admin-panel/events/view-event/edit-flow/edit-flow.component';
import { EditStepComponent } from './admin-panel/events/view-event/edit-flow/edit-step/edit-step.component';

export function initialiseApp(config: SharedService) {
  return () => config.initialise();
}

@NgModule({
  declarations: [
    IfChangesDirective,
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
    TimetableComponent,
    SessionFormComponent,
    ChatComponent,
    ChatMessageComponent,
    ViewSurveyComponent,
    CreateSurveyComponent,
    ChartComponent,
    VenueInputComponent,
    MapComponent,
    ConfirmDialogComponent,
    LiveQuestionsComponent,
    AskQuestionComponent,
    ViewCourseComponent,
    SearchBarComponent,
    UpdateCourseComponent,
    UpdateDetailsComponent,
    UpdateSessionsComponent,
    UpdatePermissionsComponent,
    ViewUserComponent,
    MarkdownPipe,
    LoginComponent,
    MakeBookingComponent,
    ViewBookingsComponent,
    BookingsComponent,
    BookableSessionFormComponent,
    AdminPanelComponent,
    VenuesComponent,
    ViewBuildingComponent,
    NewBuildingComponent,
    FilterPipe,
    EventsComponent,
    ViewEventComponent,
    ViewFloorComponent,
    EditFlowComponent,
    EditStepComponent,
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
export class AppModule {
}
