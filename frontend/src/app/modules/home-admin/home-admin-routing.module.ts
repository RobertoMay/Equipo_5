import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeAdminComponent } from './home-admin.component';
import { ApplicantsComponent } from './applicants/applicants.component';
import { EnrolledStudentsComponent } from './enrolled-students/enrolled-students.component';

const routes: Routes = [
  { path: '', component: HomeAdminComponent },
  { path: 'applicants', component: ApplicantsComponent },
  { path: 'enrrolled', component: EnrolledStudentsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeAdminRoutingModule {}
