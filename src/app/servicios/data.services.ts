import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Usuario } from "../clases/usuario";
//import { Empleado } from "./empleado.model";

@Injectable()
export class DataServices{

    constructor(private HttpClient:HttpClient){

    }
    cargarJugadasUsuario(usuario:string){
        let nombreUsuario=usuario.split('@')[0];
        let url:string='https://sandboxchess-default-rtdb.europe-west1.firebasedatabase.app/usuarios/'+nombreUsuario+'.json';
        return this.HttpClient.get(url);
    }

    guardarJugadasUsuario(usuario:Usuario,nombreJugada:string){
        let nombreUsuario = usuario.email.split('@')[0];
        let tablero = usuario.jugada
        let infoGuardar={
            jugada:nombreJugada,
            codigo:tablero,
        };
        let url:string = 'https://sandboxchess-default-rtdb.europe-west1.firebasedatabase.app/usuarios/'+nombreUsuario+'.json';
        this.HttpClient.post<any>(url,infoGuardar).subscribe({
        next: (v) => alert('Se han guardado la jugada ' + usuario.jugada),  
        error: (e) => console.log('Error' + e),
          }
        );
    }

}