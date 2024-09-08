import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResgistrationViewComponent } from './resgistration-view/resgistration-view.component';

const routes: Routes = [{ path: '', component: ResgistrationViewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationRoutingModule {}
