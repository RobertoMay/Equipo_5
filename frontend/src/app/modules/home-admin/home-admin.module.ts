import { NgModule } from '@angular/core';
import { HomeAdminComponent } from './home-admin.component';
import { SharedModule } from '@shared/shared.module';
import { HomeAdminRoutingModule } from './home-admin-routing.module';
import { EditCallModule } from './edit-call/edit-call.module';
import { CreateCallModule } from './create-call/create-call.module';
import { ApplicantsModule } from './applicants/applicants.module';
import { EnrolledStudentsModule } from './enrolled-students/enrolled-students.module';
import { GeneralModule } from './general/general.module';


@NgModule({
  declarations: [HomeAdminComponent,],

  imports: [
    SharedModule,
    HomeAdminRoutingModule,
    EditCallModule,
    CreateCallModule,
    ApplicantsModule,
    EnrolledStudentsModule,
    GeneralModule,
  ],
})
export class HomeAdminModule {}
