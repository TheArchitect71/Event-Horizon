import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent, DirectoryComponent, PersonDetailComponent, PersonFormComponent, AboutComponent, NotFoundComponent } from './directory/pages';
const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  { path: 'overview', component: OverviewComponent, title: 'Overview · Event Horizon' },
  { path: 'people', component: DirectoryComponent, title: 'People · Event Horizon' },
  { path: 'people/new', component: PersonFormComponent, title: 'Add person · Event Horizon' },
  { path: 'people/:id/edit', component: PersonFormComponent, title: 'Edit person · Event Horizon' },
  { path: 'people/:id', component: PersonDetailComponent, title: 'Profile · Event Horizon' },
  { path: 'about', component: AboutComponent, title: 'About · Event Horizon' },
  { path: '**', component: NotFoundComponent, title: 'Page not found · Event Horizon' }
];
@NgModule({ imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })], exports: [RouterModule] })
export class AppRoutingModule {}
