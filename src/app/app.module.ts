import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

// components
import { AppComponent } from './app.component';

// views
import HomeComponent from '../view/index/default/index.component';
import WebpComponent from '../view/app/default/app.component';
import { FooterComponent } from '../components/footer/footer.component';
import { IconGitComponent } from '../components/icon-git/icon-git.component';
import { NoDataComponent } from '../components/no-data/no-data.component';
import { LoadingComponent } from '../components/loading/loading.component';

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
    WebpComponent,
    FooterComponent,
    IconGitComponent,
    NoDataComponent,
    LoadingComponent
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
