import { NgModule } from '@angular/core';
import { HomeAdminComponent } from './home-admin.component';
import { SharedModule } from '@shared/shared.module';
import { EnrolledStudentsComponent } from './enrolled-students/enrolled-students.component';
import { HomeAdminRoutingModule } from './home-admin-routing.module';

@NgModule({
  declarations: [HomeAdminComponent,EnrolledStudentsComponent ],

  imports: [SharedModule, HomeAdminRoutingModule],
})
export class HomeAdminModule {}
