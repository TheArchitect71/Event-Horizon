import { BrowserModule } from '@angular/platform-browser';
import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OverviewComponent, DirectoryComponent, PersonDetailComponent, PersonFormComponent, AboutComponent, NotFoundComponent } from './directory/pages';
@NgModule({
  declarations: [AppComponent, OverviewComponent, DirectoryComponent, PersonDetailComponent, PersonFormComponent, AboutComponent, NotFoundComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule, ReactiveFormsModule, AppRoutingModule],
  providers: [provideZoneChangeDetection()], bootstrap: [AppComponent]
})
export class AppModule {}
