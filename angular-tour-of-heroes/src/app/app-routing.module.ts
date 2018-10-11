import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { HeroesComponent } from './heroes/heroes.component';
import { DashboardComponent }   from './dashboard/dashboard.component';
import { HeroDetailComponent }  from './hero-detail/hero-detail.component';

//Routes tell the router which view to display when a user clicks a link or pastes a URL into the browser address bar.
//A typical Angular Route has two properties: path, 
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },  
  { path: 'heroes', component: HeroesComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail/:id', component: HeroDetailComponent },  
];

@NgModule({
  exports: [RouterModule],

  //You first must initialize the router and start it listening for browser location changes.
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule { }