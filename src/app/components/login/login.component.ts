import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutentificarService } from 'src/app/servicios/autentificar.service';  



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AutentificarService,private router:Router) { }

  usuario = {
    email: '',
    password: '',
  }

  ingresar(){
    const {email,password}= this.usuario;
    this.authService.login(email,password).then(() =>{
      this.router.navigate(['/perfil']);
    });
  }

  ingresarGoogle(){
    const {email,password}= this.usuario;
    this.authService.loginGoogle(email,password).then(() =>{
      this.router.navigate(['/perfil']);
    });
  }

  logOut(){
    this.authService.logOut();
  }

  

  ngOnInit(): void {
  }

}
