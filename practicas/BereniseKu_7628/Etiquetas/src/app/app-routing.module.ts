import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

export const routes: Routes = [
   /* {
        path: '',
        children:[
            {
                path:'',
                loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
            },
        ],
       /* path: "", component: HomeComponent,*/
    /**/ 

   // Redirige a /home al cargar la aplicación
    { path: '', component: HomeComponent }, 
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
