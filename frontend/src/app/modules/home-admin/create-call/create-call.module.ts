import { NgModule } from '@angular/core';
import { CreateCallComponent } from './create-call.component';
import { ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule

@NgModule({
  declarations: [CreateCallComponent],
  imports: [ReactiveFormsModule],
})
export class CreateCallModule {}
