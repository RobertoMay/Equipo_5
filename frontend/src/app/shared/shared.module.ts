import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import * as fromComponents from './components';
import { Step3Component } from './components/step-3/step-3.component';
import { FileBtnComponent } from './components/file-btn/file-btn.component';
import { BtnVerDocumentosAdmComponent } from './components/btn-ver-documentos-adm/btn-ver-documentos-adm.component';
import { GestDocStudentsComponent } from './components/gest-doc-students/gest-doc-students.component';

@NgModule({
  imports: [FormsModule, ReactiveFormsModule, HttpClientModule, CommonModule],
  declarations: [
    ...fromComponents.components,
    Step3Component,
    FileBtnComponent,
    BtnVerDocumentosAdmComponent,
    GestDocStudentsComponent,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    BtnVerDocumentosAdmComponent,
    GestDocStudentsComponent,
    ...fromComponents.components,
  ],
})
export class SharedModule {}
