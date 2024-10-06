import { NgModule } from '@angular/core';
import { HomeAdminComponent } from './home-admin.component';
import { SharedModule } from '@shared/shared.module';
import { HomeAdminRoutingModule } from './home-admin-routing.module';
import { NavbarComponent } from '@layout/navbar/navbar.component';
@NgModule({
  declarations: [HomeAdminComponent,],
  
  imports: [SharedModule, HomeAdminRoutingModule,],
})
export class HomeAdminModule {}
