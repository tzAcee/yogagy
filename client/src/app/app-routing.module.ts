import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashComponent } from './dash/dash.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DetailsComponent } from './details/details.component';


const routes: Routes = [{ path: 'dash', component: DashComponent },
{ path: 'day/:id',      component: DetailsComponent },
{ path: '',
  redirectTo: '/dash',
  pathMatch: 'full'
},
{ path: '**', component: PageNotFoundComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
