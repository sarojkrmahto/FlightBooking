import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookFlightComponent } from './book-flight/book-flight.component';
import { ViewDetailsComponent } from './view-details/view-details.component';

const routes: Routes = [
    // configure the routes here
    {path: 'book', component: BookFlightComponent},
    {path: 'view', component: ViewDetailsComponent},
    {path: '*', component: BookFlightComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
