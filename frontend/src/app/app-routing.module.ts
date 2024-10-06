import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkeletonComponent } from '@layout/skeleton/skeleton.component';
import { HomeAdminComponent } from '@modules/home-admin/home-admin.component';
import { HomeAdminModule } from '@modules/home-admin/home-admin.module';
import { LoginComponent } from '@modules/login/login.component';
import { StudentPortalComponent } from '@modules/student-portal/student-portal.component';

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
      {
        path: 'admin',
        loadChildren: () =>
          import('@modules/home-admin/home-admin.module').then(
            (m) => m.HomeAdminModule
          ),
      },
      /*{
        path: 'student',
        loadChildren: () =>
          import('@modules/student-portal/student-portal.component').then(
            (m) => m.StudentPortalComponent
          ),
      },*/
      {
        path: 'activities',
        loadChildren: () =>
          import('@modules/activities/activities.module').then(
            (m) => m.ActivitiesModule
          ),
      },
      {
        path: 'student',
        loadChildren: () => import('@modules/student-portal/student-portal.module').then((m) => m.StudentPortalModule),
      },
    ],
  },
  { path: 'login', component: LoginComponent },
  //{ path: 'student', component: StudentPortalComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
 // {path: 'admin', component:HomeAdminComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
