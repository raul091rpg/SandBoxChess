import { Component, OnInit } from '@angular/core';
import { AutentificarService } from 'src/app/servicios/autentificar.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  userLogged=this.authService.getUsuarioLogeado();

  constructor(private authService:AutentificarService) { }

  ngOnInit(): void {
  }

  logOut(){
    this.authService.logOut();
  }

}
