import { NgModule } from '@angular/core';
import {UploadComponent} from './upload/upload.component'
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent }   from './dashboard/dashboard.component';
import { ProfileComponent }   from './profile/profile.component';
import {ProfileDetailsComponent} from "./profile-details/profile-details.component";
const routes: Routes = [
  { path: 'upload', component: UploadComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile/:id', component: ProfileDetailsComponent },
  { path: '', redirectTo: '/upload', pathMatch: 'full' },];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ],

})


export class AppRoutingModule {}

