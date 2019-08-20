import { MapComponent } from './map/map.component';
import { ChatComponent } from './chat/chat.component';
import { ForumComponent } from './forum/forum.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoursesComponent } from './courses/courses.component';
import { MainComponent } from './main/main.component';
import { PostComponent } from './forum/post/post.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { EditCourseComponent } from './courses/edit-course/edit-course.component';
import { TimetableComponent } from './timetable/timetable.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  {
    path: 'courses', children: [
      { path: '', component: CoursesComponent },
      {
        path: ':code', children: [
          {
            path: 'forum', children: [
              { path: '', component: ForumComponent },
              { path: ':post', component: PostComponent }
            ]
          },
          { path: 'edit', component: EditCourseComponent },
          { path: 'announcements', component: AnnouncementsComponent },
          { path: 'chat', component: ChatComponent }
        ]
      }
    ]
  },
  { path: 'timetable', component: TimetableComponent },
  {
    path: 'map', children: [
      { path: '', component: MapComponent },
      { path: ':building', component: MapComponent }
    ]
  },
  { path: '**', component: MainComponent, redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
