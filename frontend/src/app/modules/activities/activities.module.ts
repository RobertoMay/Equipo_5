import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ActivitiesComponent } from './activities.component';
import { ActivitiesRoutingModule } from './activities-routing.module';


@NgModule({
  declarations: [
    ActivitiesComponent
  ],
  imports: [
    SharedModule, ActivitiesRoutingModule
  ]
})
export class ActivitiesModule { }
