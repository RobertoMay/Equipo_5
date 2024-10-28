import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { EnrolledStudentsComponent } from './enrolled-students.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [EnrolledStudentsComponent],
  imports: [SharedModule, CommonModule],
})
export class EnrolledStudentsModule {}
