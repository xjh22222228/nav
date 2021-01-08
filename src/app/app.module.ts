import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { FormsModule } from '@angular/forms'
import config from '../../nav.config'

// components
import { AppComponent } from './app.component'

// views
import LightComponent from '../view/index/light/index.component'
import SimComponent from '../view/index/sim/index.component'
import WebpComponent from '../view/app/default/app.component'
import { FixbarComponent } from '../components/fixbar/index.component'
import { MultipleSiteComponent } from '../components/multiple-site/index.component'
import { FooterComponent } from '../components/footer/footer.component'
import { IconGitComponent } from '../components/icon-git/icon-git.component'
import { NoDataComponent } from '../components/no-data/no-data.component'
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
    redirectTo: '/' + config.theme,
  },
]


@NgModule({
  declarations: [
    AppComponent,
    LightComponent,
    SimComponent,
    WebpComponent,
    FixbarComponent,
    MultipleSiteComponent,
    FooterComponent,
    IconGitComponent,
    NoDataComponent,
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
