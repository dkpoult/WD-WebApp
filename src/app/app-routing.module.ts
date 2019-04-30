import { ForumComponent } from './forum/forum.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeaturesComponent } from './features/features.component';
import { CoursesComponent } from './courses/courses.component';
import { MainComponent } from './main/main.component';
import { PostComponent } from './post/post.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { EditCourseComponent } from './edit-course/edit-course.component';

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
          { path: 'announcements', component: AnnouncementsComponent }
        ]
      }
    ]
  },
  { path: '**', component: MainComponent, redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
