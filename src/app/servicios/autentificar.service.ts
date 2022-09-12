import { Injectable } from '@angular/core';
import {AngularFireAuth, AngularFireAuthModule} from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';


@Injectable({
  providedIn: 'root'
})
export class AutentificarService {

  constructor(private autentificacion: AngularFireAuth) { }

  async registrer(email:string, password:string){
    try {
      return await this.autentificacion.createUserWithEmailAndPassword(email,password);
    } catch (error) {
      return null;
    }
  }

  async login(email:string, password:string){
    try {
      return await this.autentificacion.signInWithEmailAndPassword(email,password);
    } catch (error) {
      return null;
    }
  }

  async loginGoogle(email:string, password:string){
    try {
      return await this.autentificacion.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    } catch (error) {
      return null;
    }
  }

  getUsuarioLogeado(){
    return this.autentificacion.authState;
  }

  logOut(){
    this.autentificacion.signOut();
  }

  obtenerEmailUsuario(){
    return this.autentificacion.currentUser;
  }

}
