import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { GeneralComponent } from './general.component';

@NgModule({
  declarations: [GeneralComponent],
  imports: [SharedModule],
})
export class GeneralModule {}
