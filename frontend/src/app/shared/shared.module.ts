import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import * as fromComponents from './components';
import { Step3Component } from './components/step-3/step-3.component';
import { FileBtnComponent } from './components/file-btn/file-btn.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AvisoPrivComponent } from './components/aviso-priv/aviso-priv.component';

@NgModule({
  imports: [FormsModule, ReactiveFormsModule, HttpClientModule, CommonModule],
  declarations: [
    ...fromComponents.components,
    Step3Component,
    FileBtnComponent,
    AvisoPrivComponent,
  
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    NgApexchartsModule,
    ...fromComponents.components,
  ],
})
export class SharedModule {}
