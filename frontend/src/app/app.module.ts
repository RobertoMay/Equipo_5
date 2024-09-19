import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { SkeletonComponent } from './layout/skeleton/skeleton.component';
import { AboutUsComponent } from './modules/about-us/about-us.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgxUiLoaderConfig } from 'ngx-ui-loader';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsColor: '#b0af9d',
  bgsColor: '#b0af9d',
  bgsOpacity: 0.5,
  bgsType: 'ball-spin-fade-rotating',
  fgsType: 'ball-spin-fade-rotating',
  overlayColor: 'rgba(40,40,40,0.8)',
  hasProgressBar: false,
};

@NgModule({
  declarations: [
    AppComponent,
    SkeletonComponent,
    NavbarComponent,
    AboutUsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    FooterComponent,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
  ],
  providers: [{ provide: LocationStrategy, useClass: PathLocationStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
