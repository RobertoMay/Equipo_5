import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkeletonComponent } from '@layout/skeleton/skeleton.component';
import { LoginComponent } from '@modules/login/login.component';


const routes: Routes = [
  {
    path: '',
    component: SkeletonComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@modules/home/home.module').then((m) => m.HomeModule),
   
      },
      {
        path: 'registration',
        loadChildren: () =>
          import('@modules/registration/registration.module').then(
            (m) => m.RegistrationModule
          ),
      },
      {
        path: 'about-us',
        loadChildren: () =>
          import('@modules/about-us/about-us.module').then(
            (m) => m.AboutUsModule
          ),
      },
    ],
  },
  {path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
