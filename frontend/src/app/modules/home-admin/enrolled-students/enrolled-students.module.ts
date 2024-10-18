import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { EnrolledStudentsComponent } from './enrolled-students.component';

@NgModule({
  declarations: [EnrolledStudentsComponent],
  imports: [SharedModule],
})
export class EnrolledStudentsModule {}
