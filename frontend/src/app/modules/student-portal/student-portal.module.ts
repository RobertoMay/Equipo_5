import { NgModule } from '@angular/core';
import { StudentPortalComponent } from './student-portal.component';
import { SharedModule } from '@shared/shared.module';
import { StudentPortalRoutingModule } from './student-portal-routing.module';
import { ButtonPdfComponent } from './button-pdf/button-pdf.component';


@NgModule({
  declarations: [StudentPortalComponent,  ButtonPdfComponent],
  imports: [SharedModule, StudentPortalRoutingModule],
})
export class StudentPortalModule {}
