import {MapComponent} from './map/map.component';
import {ChatComponent} from './chat/chat.component';
import {ForumComponent} from './forum/forum.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CoursesComponent} from './courses/courses.component';
import {MainComponent} from './main/main.component';
import {PostComponent} from './forum/post/post.component';
import {AnnouncementsComponent} from './announcements/announcements.component';
import {TimetableComponent} from './timetable/timetable.component';
import {UpdateCourseComponent} from './courses/update-course/update-course.component';
import {AuthGuard} from './shared/guards/auth-guard.service';
import {LoginComponent} from './main/login/login.component';
import {BookingsComponent} from './bookings/bookings.component';

const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'login', component: LoginComponent},
  {
    path: 'courses', canActivate: [AuthGuard], canActivateChild: [AuthGuard], children: [
      {path: '', component: CoursesComponent},
      {
        path: ':code', children: [
          {
            path: 'forum', children: [
              {path: '', component: ForumComponent},
              {path: ':post', component: PostComponent}
            ]
          },
          {path: 'edit', component: UpdateCourseComponent},
          {path: 'announcements', component: AnnouncementsComponent},
          {path: 'chat', component: ChatComponent},
          {path: 'bookings', component: BookingsComponent}
        ]
      }
    ]
  },
  {path: 'timetable', component: TimetableComponent},
  {
    path: 'map', children: [
      {path: '', component: MapComponent},
      {path: ':building', component: MapComponent}
    ]
  },
  {path: '**', component: MainComponent, redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
