import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { EnrolledStudentsComponent } from './enrolled-students.component';
import { CommonModule } from '@angular/common';
import { GestDocStudentsComponent } from '@shared/components/gest-doc-students/gest-doc-students.component';
@NgModule({
  declarations: [EnrolledStudentsComponent],
  imports: [SharedModule, CommonModule ],
})
export class EnrolledStudentsModule {}
