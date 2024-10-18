import { NgModule } from '@angular/core';
import { StudentPortalComponent } from './student-portal.component';
import { SharedModule } from '@shared/shared.module';
import { StudentPortalRoutingModule } from './student-portal-routing.module';
import { PdfPageComponent } from './pdf-page/pdf-page.component';

@NgModule({
  declarations: [StudentPortalComponent, PdfPageComponent],
  imports: [SharedModule, StudentPortalRoutingModule],
})
export class StudentPortalModule {}
