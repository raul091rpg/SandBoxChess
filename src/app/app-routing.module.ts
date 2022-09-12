import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfiguracionComponent } from './components/configuracion/configuracion.component';
import { LoginComponent } from './components/login/login.component';
import { PaginaErrorComponent } from './components/pagina-error/pagina-error.component';
import { PaginaGanadorComponent } from './components/pagina-ganador/pagina-ganador.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { RegistroComponent } from './components/registro/registro.component';
import { TableroComponent } from './components/tablero/tablero.component';

const routes: Routes = [
  {
    pathMatch:'full',
    path:"",
    redirectTo:'inicio'
  },
  {
    path:"inicio",
    component:TableroComponent
  },
  {
    path:"configuracion",
    component:ConfiguracionComponent
  },
  {
    path:"perfil",
    component:PerfilComponent
  },
  {
    path:"login",
    component:LoginComponent
  },
  {
    path:"registro",
    component:RegistroComponent
  },
  {
    path:"ganador",
    component:PaginaGanadorComponent
  },
  {
    path:"**",
    component:PaginaErrorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
