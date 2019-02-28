import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeaturesComponent } from './features/features.component';

const routes: Routes = [
  { path: 'features', component: FeaturesComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
