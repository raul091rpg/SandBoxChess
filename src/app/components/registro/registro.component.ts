import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutentificarService } from 'src/app/servicios/autentificar.service'; 

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  constructor(private authService: AutentificarService,private router:Router) { }

  usuario = {
    email: '',
    password: '',
  }

  registrar(){
    const {email,password}= this.usuario;
    this.authService.registrer(email,password).then(() =>{
      this.router.navigate(['/perfil']);
    });
  }

  ngOnInit(): void {
  }

}

