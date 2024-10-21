import { NgModule } from '@angular/core';
import { HomeAdminComponent } from './home-admin.component';
import { SharedModule } from '@shared/shared.module';
import { EnrolledStudentsComponent } from './enrolled-students/enrolled-students.component';
import { HomeAdminRoutingModule } from './home-admin-routing.module';

import { EditCallModule } from './edit-call/edit-call.module';
import { CreateCallModule } from './create-call/create-call.module';
import { ApplicantsModule } from './applicants/applicants.module';
import { EnrolledStudentsModule } from './enrolled-students/enrolled-students.module';


@NgModule({
  declarations: [HomeAdminComponent,EnrolledStudentsComponent ],

  imports: [
    SharedModule,
    HomeAdminRoutingModule,
    EditCallModule,
    CreateCallModule,
    ApplicantsModule,
    EnrolledStudentsModule,
  ],
})
export class HomeAdminModule {}
