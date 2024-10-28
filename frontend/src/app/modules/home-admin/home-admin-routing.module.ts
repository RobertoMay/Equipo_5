import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeAdminComponent } from './home-admin.component';
import { ApplicantsComponent } from './applicants/applicants.component';
import { EnrolledStudentsComponent } from './enrolled-students/enrolled-students.component';
import { CreateCallComponent } from './create-call/create-call.component';
import { EditCallComponent } from './edit-call/edit-call.component';
import { GeneralComponent } from './general/general.component';

const routes: Routes = [
  { path: '', component: HomeAdminComponent },
  { path: 'applicants', component: ApplicantsComponent },
  { path: 'enrolled', component: EnrolledStudentsComponent },
  { path: 'create-call', component: CreateCallComponent },
  { path: 'edit-call', component: EditCallComponent },
  { path: 'general', component: GeneralComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeAdminRoutingModule {}
