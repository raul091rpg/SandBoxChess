import { Component, OnInit } from '@angular/core';
import { Jugada } from 'src/app/clases/jugada';
import { Usuario } from 'src/app/clases/usuario';
import { AutentificarService } from 'src/app/servicios/autentificar.service';
import { DataServices } from 'src/app/servicios/data.services';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {


  userLogged=this.authService.getUsuarioLogeado();
  jugadas:Jugada[]=[];
  mostrarJugadas=true;
  configuracion=false;
  valueJugada='';

  constructor(private authService:AutentificarService,private dataService:DataServices) { }

  ngOnInit(): void {
  }

  obtenerTablerosUsuario(usuario:string|null){
    if(usuario){
      this.dataService.cargarJugadasUsuario(usuario).subscribe(jugadasUsuario=>{
        this.jugadas=Object.values(jugadasUsuario);
      });
      this.mostrarJugadas=false;
    } 
  }

  cargarTableroJugada(){
    let value = (<HTMLSelectElement>document.getElementById('codJugada')).value;
    this.configuracion=true;
    this.valueJugada=value;
  }

}
