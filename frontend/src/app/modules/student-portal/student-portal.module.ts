import { NgModule } from '@angular/core';
import { StudentPortalComponent } from './student-portal.component';
import { SharedModule } from '@shared/shared.module';
import { StudentPortalRoutingModule } from './student-portal-routing.module';

@NgModule({
  declarations: [StudentPortalComponent],
  imports: [SharedModule, StudentPortalRoutingModule],
})
export class StudentPortalModule {}
