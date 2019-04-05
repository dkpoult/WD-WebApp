import { ForumComponent } from './forum/forum.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeaturesComponent } from './features/features.component';
import { CoursesComponent } from './courses/courses.component';
import { MainComponent } from './main/main.component';
import { PostComponent } from './post/post.component';
import { AnnouncementsComponent } from './announcements/announcements.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'features', component: FeaturesComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'courses/:code/forum', component: ForumComponent },
  { path: 'courses/:code/announcements', component: AnnouncementsComponent },
  { path: 'courses/:code/forum/:post', component: PostComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
