import { NgModule } from '@angular/core';
import { CreateCallComponent } from './create-call.component';
import { ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule
import { SharedModule } from '@shared/shared.module';
@NgModule({
  declarations: [CreateCallComponent],
  imports: [ ReactiveFormsModule, SharedModule],
})
export class CreateCallModule {}
