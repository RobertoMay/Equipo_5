import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import * as fromComponents from './components';
import { RegistrationFormComponent } from './components/registration-form/registration-form.component';

@NgModule({
  imports: [FormsModule, ReactiveFormsModule, HttpClientModule, CommonModule],
  declarations: [...fromComponents.components, RegistrationFormComponent],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    ...fromComponents.components,
  ],
})
export class SharedModule {}
