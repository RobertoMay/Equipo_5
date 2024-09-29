import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    SharedModule, LoginRoutingModule,
    ReactiveFormsModule, CommonModule
   
  ]
})
export class LoginModule { }
