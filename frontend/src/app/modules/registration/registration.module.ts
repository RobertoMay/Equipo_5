import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ResgistrationViewComponent } from './resgistration-view/resgistration-view.component';
import { RegistrationRoutingModule } from './registration-routing.module';

@NgModule({
  declarations: [ResgistrationViewComponent],
  imports: [SharedModule, RegistrationRoutingModule],
})
export class RegistrationModule {}
