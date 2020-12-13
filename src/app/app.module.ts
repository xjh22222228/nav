import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { THEME } from '../../config'

// components
import { AppComponent } from './app.component'

// views
import LightComponent from '../view/index/light/index.component'
import SimComponent from '../view/index/sim/index.component'
import WebpComponent from '../view/app/default/app.component'
import { FixbarComponent } from '../components/fixbar/index.component'
import { FooterComponent } from '../components/footer/footer.component'
import { IconGitComponent } from '../components/icon-git/icon-git.component'
import { NoDataComponent } from '../components/no-data/no-data.component'
import { LoadingComponent } from '../components/loading/loading.component'
import { SearchEngineComponent } from '../components/search-engine/search-engine.component'

const appRoutes: Routes = [
  { 
    path: 'sim',
    component: SimComponent,
  },
  { 
    path: 'light',
    component: LightComponent,
  },
  { 
    path: 'app',
    component: WebpComponent,
  },
  {
    path: '**',
    redirectTo: '/' + THEME,
  },
]


@NgModule({
  declarations: [
    AppComponent,
    LightComponent,
    SimComponent,
    WebpComponent,
    FixbarComponent,
    FooterComponent,
    IconGitComponent,
    NoDataComponent,
    LoadingComponent,
    SearchEngineComponent
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
