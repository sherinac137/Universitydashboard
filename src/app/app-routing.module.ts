import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCountryComponent } from './pages/add-country/add-country.component';
import { ListCountryComponent } from './pages/list-country/list-country.component';
import { AddUniversityComponent } from './pages/add-university/add-university.component';
import { ListUniversityComponent } from './pages/list-university/list-university.component';

const routes: Routes = [
  { path: 'add-country', component: AddCountryComponent },
  { path: 'list-country', component: ListCountryComponent },
  { path: 'add-university', component: AddUniversityComponent },
  { path: 'list-university', component: ListUniversityComponent },
  { path: '', redirectTo: '/list-country', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
