import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MenuComponent } from './components/menu/menu.component';
import { RegistroComponent } from './components/registro/registro.component';
import { PaginaErrorComponent } from './components/pagina-error/pagina-error.component';
import { TableroComponent } from './components/tablero/tablero.component';
import { ConfiguracionComponent } from './components/configuracion/configuracion.component';
import { DataServices } from 'src/app/servicios/data.services';
import { HttpClientModule } from '@angular/common/http';
import { PerfilComponent } from './components/perfil/perfil.component';
import { PaginaGanadorComponent } from './components/pagina-ganador/pagina-ganador.component';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    RegistroComponent,
    PaginaErrorComponent,
    TableroComponent,
    ConfiguracionComponent,
    PerfilComponent,
    PaginaGanadorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    NgbModule,
    HttpClientModule
  ],
  providers: [DataServices],
  bootstrap: [AppComponent]
})
export class AppModule { }
