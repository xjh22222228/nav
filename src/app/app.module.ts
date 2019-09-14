import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

// components
import { AppComponent } from './app.component';

// views
import { HomeComponent } from '../view/index.component';
import { WebpComponent } from '../view/app.component';


const appRoutes: Routes = [
  { 
    path: 'index',
    component: HomeComponent,
  },
  { 
    path: 'app',
    component: WebpComponent,
  },
  {
    path: '**',
    redirectTo: '/index',
  },
];


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebpComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: false,     // <-- debugging purposes only
        useHash: true,
      }
    )
  ],
  providers: [],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }
