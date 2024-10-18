import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ApplicantsComponent } from './applicants.component';

@NgModule({
  declarations: [ApplicantsComponent],
  imports: [SharedModule],
})
export class ApplicantsModule {}
