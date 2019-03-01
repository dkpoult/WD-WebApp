import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeaturesComponent } from './features/features.component';
import { CoursesComponent } from './courses/courses.component';
import { AuthGuardService } from './shared/auth-guard.service';

const routes: Routes = [
  { path: 'features', component: FeaturesComponent },
  { path: 'courses', component: CoursesComponent, canActivate: [AuthGuardService] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
