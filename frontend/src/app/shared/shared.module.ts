import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import * as fromComponents from './components';
import { Step3Component } from './components/step-3/step-3.component';
import { FileBtnComponent } from './components/file-btn/file-btn.component';

@NgModule({
  imports: [FormsModule, ReactiveFormsModule, HttpClientModule, CommonModule],
  declarations: [
    ...fromComponents.components,
    Step3Component,
    FileBtnComponent,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    ...fromComponents.components,
  ],
})
export class SharedModule {}
