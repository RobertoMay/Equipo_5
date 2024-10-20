import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { SkeletonComponent } from './layout/skeleton/skeleton.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgxUiLoaderConfig } from 'ngx-ui-loader';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginModule } from './modules/login/login.module';
import { ReactiveFormsModule } from '@angular/forms';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsColor: '#9d2449',
  bgsColor: '#b0af9d',
  bgsOpacity: 0.5,
  bgsType: 'ball-spin-fade-rotating',
  fgsType: 'ball-spin-fade-rotating',
  overlayColor: 'rgba(40,40,40,0.5)',
  hasProgressBar: false,
};

const routes: Routes = [];

@NgModule({
  declarations: [AppComponent, SkeletonComponent, NavbarComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    FooterComponent,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
    NgbModule,
    ReactiveFormsModule,
    LoginModule,
  ],
  providers: [{ provide: LocationStrategy, useClass: PathLocationStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
