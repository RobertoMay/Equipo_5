import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter, Route } from '@angular/router';
import { HomeComponent } from './app/home/home.component';

const routes: Route[] = [
  // Otras rutas...
];

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
