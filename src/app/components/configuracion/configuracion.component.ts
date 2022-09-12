import { Component, OnInit, ViewChild, ElementRef, AfterViewInit,HostListener, Input,Inject } from '@angular/core';
import { Color, Tema, TipoPieza,TipoPiezaConfiguracion } from 'src/app/clases/tipos';
import { Cuadro } from '../../clases/cuadro';
import { Pieza } from '../../clases/pieza';
import { Peon } from 'src/app/clases/piezas/Peon';
import { Caballo } from 'src/app/clases/piezas/Caballo';
import { Alfil } from 'src/app/clases/piezas/Alfil';
import { Torre } from 'src/app/clases/piezas/Torre';
import { Reina } from 'src/app/clases/piezas/Reina';
import { Rey } from 'src/app/clases/piezas/Rey';
import {Router} from '@angular/router';
import socket from 'src/app/servicios/socket';
import { AutentificarService } from 'src/app/servicios/autentificar.service';
import { DataServices } from 'src/app/servicios/data.services';
import { Usuario } from 'src/app/clases/usuario';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css'],
})

export class ConfiguracionComponent implements OnInit,AfterViewInit {

  dimension:number=8;
  fen:string='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
  letrasPosibles:string='rnbqkbnrpPRNBQKBNR';

  formulario = {
    dimension: 8,
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
    nombre: '',
    sala: ''
  }

  salaID:string|null=null;
  userLogged=this.authService.getUsuarioLogeado();
  cadenasFen: string[]=[];
  ancho: number = 600;
  alto: number = 600;
  anchoCuadro = Math.round(this.ancho/this.dimension);
  altoCuadro = Math.round(this.alto/this.dimension);
  tableroAux : string[][] = [[]];
  tablero : Cuadro[][] = [[]];
  selectorPiezas : Cuadro [][] = [];
  tema : Tema | undefined;
  ajusteAlto: number = 0.05 * this.alto;
  temaPieza: Tema | undefined;
  celdaSeleccionada : number[] = [];
  celdaPrevia : number [] = [];
  celdaPreviaXY :  [number, number] = [0,0];
  piezaSeleccionada : Pieza = new Pieza(Color.niguno,[""],TipoPieza.ninguna);
  TableroNegro : boolean = false;
  mostrarFormulario=true;
  mostrarTablero=false;
  piezaSelector: Pieza = new Pieza(Color.niguno,[""],TipoPieza.ninguna);
  situacionTablero: string = '';
  @Input()datosJugada: string|null = null;

  @ViewChild('canvasRef', {static: false}) canvasRef: any;
  private ctx!: CanvasRenderingContext2D;
  @ViewChild('canvasRefPiezas', {static: false}) canvasRefPiezas: any;
  private ctx2!: CanvasRenderingContext2D;
  
  constructor(private authService:AutentificarService, private dataService:DataServices,private router:Router) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  calcularTamanyoFuente(cuadros:number):string{
    var resultado:string="";
    var aux:number=Math.round((this.ancho/cuadros)*0.80);
    resultado="400 "+aux.toString()+"px Arial";
    return resultado;
  }

  comprobarFen(fen:string){
    let valido = false;
    let j = 0;
    let contador=0;
    let number=0;
    let x=0;
    this.cadenasFen=[];
    for(let i = 0; i < this.fen.length; i++){
      if(!this.cadenasFen[j])this.cadenasFen[j]='';
      if(this.fen[i]!='/'){
        this.cadenasFen[j]=this.cadenasFen[j].concat(this.fen[i]);
      }
      else{
        j++;
      }
    }
    for(let i = 0; i < this.cadenasFen.length; i++){
      contador=0;
      number=0;
      for(let j = 0; j < this.cadenasFen[i].length; j++){
        if(this.cadenasFen[i][j].charCodeAt(0)>47 && this.cadenasFen[i][j].charCodeAt(0)<58){
          if(this.cadenasFen[i][j+1]){
            if(this.cadenasFen[i][j+1].charCodeAt(0)>47 && this.cadenasFen[i][j+1].charCodeAt(0)<58){
              number=+this.cadenasFen[i][j]*10;
              contador=contador+number;
            }
            if(this.cadenasFen[i][j+1].charCodeAt(0)<48 || this.cadenasFen[i][j+1].charCodeAt(0)>57){
              number=+this.cadenasFen[i][j];
              contador=contador+number;
            }
          }
          if(!this.cadenasFen[i][j+1]){      
              number=+this.cadenasFen[i][j];
              contador=contador+number;
          }
        }
        else{
          if(!this.letrasPosibles.includes(this.cadenasFen[i][j])){
            this.cadenasFen=[];
            number=0;
            contador=0;
            alert("código FEN incorrecto o de dimension distinta");
            return false;
          }
          else{
            contador=contador+1;
          }
        }
      }
      if(this.dimension!=this.cadenasFen.length || contador!=this.dimension){
        this.cadenasFen=[];
        number=0;
        contador=0;
        alert("código FEN incorrecto o de dimension distinta");
        return false;
      }
    }
    valido = true;
    return valido;
  }

  ponerParametros(){
    this.dimension=this.formulario.dimension;
    this.fen=this.formulario.fen;
    if(this.comprobarFen(this.fen)){
      this.mostrarFormulario = false;
      this.mostrarTablero = true;
      this.crearTablero();
      this.crearSelectorPiezas();
      this.rellenarPiezas();
      this.dibujarTablero();
      this.dibujarSelector();
    }
  }

  ponerParametrosPerfil(){
    if(this.datosJugada){
      this.dimension=1;
      this.fen=this.datosJugada.split('+')[0];
      this.fen=this.fen.split(' ')[1];
      for(let i=0;i<this.fen.length;i++){
        if(this.fen[i]=='/')
        this.dimension+=1;
      }
      if(this.comprobarFen(this.fen)){
      this.mostrarFormulario = false;
      this.mostrarTablero = true;
      this.crearTablero();
      this.crearSelectorPiezas();
      this.rellenarPiezas();
      this.dibujarTablero();
      this.dibujarSelector();
      }
    }
  }

  guardarJugada(email:string|null){
    this.componerJugada();
    
    if(email&&this.formulario.nombre){
      let usuario:Usuario = new Usuario(email,this.situacionTablero);
      this.dataService.guardarJugadasUsuario(usuario,this.formulario.nombre);
    }
  }

  componerJugada(){
    let situacionTablero ='';
    let situacionTableroHabilitado ='';
    let contador=0;
    for(let x = 0; x < this.dimension; x += 1){
      
      contador=0;
      for(let y = 0; y < this.dimension; y += 1){
        let pieza;
        if(this.tablero[y][x].pieza.color == Color.negro){
          if (this.tablero[y][x].pieza.tipoPieza == TipoPieza.peon) pieza = 'p';
          else if (this.tablero[y][x].pieza.tipoPieza == TipoPieza.torre) pieza = 'r';
          else if (this.tablero[y][x].pieza.tipoPieza == TipoPieza.caballo) pieza = 'n';
          else if (this.tablero[y][x].pieza.tipoPieza == TipoPieza.alfil) pieza = 'b';
          else if (this.tablero[y][x].pieza.tipoPieza == TipoPieza.reina) pieza = 'q';
          else if (this.tablero[y][x].pieza.tipoPieza == TipoPieza.rey) pieza = 'k';
          if(contador>0){
            situacionTablero+=contador;
            contador=0;
          }
        }
        if(this.tablero[y][x].pieza.color == Color.blanco){
          if (this.tablero[y][x].pieza.tipoPieza == TipoPieza.peon) pieza = 'P';
          else if (this.tablero[y][x].pieza.tipoPieza == TipoPieza.torre) pieza = 'R';
          else if (this.tablero[y][x].pieza.tipoPieza == TipoPieza.caballo) pieza = 'N';
          else if (this.tablero[y][x].pieza.tipoPieza == TipoPieza.alfil) pieza = 'B';
          else if (this.tablero[y][x].pieza.tipoPieza == TipoPieza.reina) pieza = 'Q';
          else if (this.tablero[y][x].pieza.tipoPieza == TipoPieza.rey) pieza = 'K';
          if(contador>0){
            situacionTablero+=contador;
            contador=0;
          }
        }
        if(this.tablero[y][x].pieza.color == Color.niguno){
          pieza = '';
          contador++;
        }
        situacionTablero+=pieza;
        if(this.tablero[y][x].cuadroHabilitado==false){
          situacionTableroHabilitado+='1';
        }
        else{
          situacionTableroHabilitado+='0';
        }
      }
        if(contador>0)situacionTablero+=contador;
        situacionTablero+='/';
        situacionTableroHabilitado+='/';        
    }
    this.situacionTablero=situacionTablero.substring(0, situacionTablero.length-1)
    +'+'+situacionTableroHabilitado.substring(0, situacionTableroHabilitado.length-1);
  }

  crearTablero(): void{
    this.tablero = [];
    for(let x = 0; x < this.dimension; x += 1){
      this.tablero[x]=[];
      for(let y = 0; y < this.dimension; y += 1){
        this.tablero[x][y] = new Cuadro(new Pieza(Color.niguno,["",""],TipoPieza.ninguna),false) ;
      }
    }
  }

  crearSelectorPiezas(){
    this.selectorPiezas=[];
    for(let x = 0; x < 2; x += 1){
      this.selectorPiezas[x]=[];
      for(let y = 0; y < 12; y += 1){
        this.selectorPiezas[x][y] = new Cuadro(new Pieza(Color.niguno,["",""],TipoPieza.ninguna),false);
        if(x==1 && y>1)this.selectorPiezas[x][y].cuadroHabilitado=false;
      }
    }
  }

   rellenarPiezas(){
    this.tableroAux = [];
    for(let x = 0; x < this.dimension; x += 1){
      this.tableroAux[x]=[];
      for(let y = 0; y < this.dimension; y += 1){
        this.tableroAux[x][y] = '' ;
      }
    }
    for(let i = 0; i < this.cadenasFen.length; i++){
      let aux=0;
      for(let j = 0; j < this.cadenasFen[i].length; j++){

        //si es un valor numerico i
        if(this.cadenasFen[i][j].charCodeAt(0)>47 && this.cadenasFen[i][j].charCodeAt(0)<58){
          if(this.cadenasFen[i][j+1]){
            if(this.cadenasFen[i][j+1].charCodeAt(0)>47 && this.cadenasFen[i][j+1].charCodeAt(0)<58){
              aux=aux + (+this.cadenasFen[i][j]*10)-1;
            }
            if(this.cadenasFen[i][j+1].charCodeAt(0)<48 || this.cadenasFen[i][j+1].charCodeAt(0)>57){
              aux=aux + (+this.cadenasFen[i][j])-1;
            }
          }
        }

        //si es un valor alfabetico i
        else{         
          this.tableroAux[i][j+aux]=this.cadenasFen[i][j];
        }

      }
    }

    for(let i = 0; i < this.tableroAux.length; i++){
      for(let j = 0; j < this.tableroAux.length; j++){
        let piece;
        if (this.tableroAux[i][j] == TipoPiezaConfiguracion.peonN) piece = new Peon(Color.negro);
        else if (this.tableroAux[i][j] == TipoPiezaConfiguracion.torreN) piece = new Torre(Color.negro);
        else if (this.tableroAux[i][j] == TipoPiezaConfiguracion.caballoN) piece = new Caballo(Color.negro);
        else if (this.tableroAux[i][j] == TipoPiezaConfiguracion.alfilN) piece = new Alfil(Color.negro);
        else if (this.tableroAux[i][j] == TipoPiezaConfiguracion.reinaN) piece = new Reina(Color.negro);
        else if (this.tableroAux[i][j] == TipoPiezaConfiguracion.reyN) piece = new Rey(Color.negro);
        else if (this.tableroAux[i][j] == TipoPiezaConfiguracion.peonB) piece = new Peon(Color.blanco);
        else if (this.tableroAux[i][j] == TipoPiezaConfiguracion.torreB) piece = new Torre(Color.blanco);
        else if (this.tableroAux[i][j] == TipoPiezaConfiguracion.caballoB) piece = new Caballo(Color.blanco);
        else if (this.tableroAux[i][j] == TipoPiezaConfiguracion.alfilB) piece = new Alfil(Color.blanco);
        else if (this.tableroAux[i][j] == TipoPiezaConfiguracion.reinaB) piece = new Reina(Color.blanco);
        else if (this.tableroAux[i][j] == TipoPiezaConfiguracion.reyB) piece = new Rey(Color.blanco);
        else if (this.tableroAux[i][j] == TipoPiezaConfiguracion.ninguna) piece = new Pieza(Color.niguno,["",""],TipoPieza.ninguna);
        else{
          piece = new Pieza(Color.niguno,["",""],TipoPieza.ninguna);
        }
        this.tablero[j][i]=new Cuadro(piece,false);
      }
    }

    //cuadrosHabilitados
    if(this.datosJugada){
      let cuadrosHabilitados=this.datosJugada.split('+')[1];
      let j=0;
      let contador=0;  
      for(let i=0;i<cuadrosHabilitados.length;i++){
        contador++;
        if(cuadrosHabilitados[i]=='1')
        this.tablero[contador-1][j].cuadroHabilitado=false;
        else if(cuadrosHabilitados[i]=='/'){
          j++;
          contador=0;
        }
      }
    }


    //Rellenar selector de Piezas:

    this.selectorPiezas[0][0] = new Cuadro(new Peon(Color.blanco),false);
    this.selectorPiezas[0][1] = new Cuadro(new Caballo(Color.blanco),false);
    this.selectorPiezas[0][2] = new Cuadro(new Alfil(Color.blanco),false);
    this.selectorPiezas[0][3] = new Cuadro(new Torre(Color.blanco),false);
    this.selectorPiezas[0][4] = new Cuadro(new Reina(Color.blanco),false);
    this.selectorPiezas[0][5] = new Cuadro(new Rey(Color.blanco),false);
    this.selectorPiezas[0][6] = new Cuadro(new Peon(Color.negro),false);
    this.selectorPiezas[0][7] = new Cuadro(new Caballo(Color.negro),false);
    this.selectorPiezas[0][8] = new Cuadro(new Alfil(Color.negro),false);
    this.selectorPiezas[0][9] = new Cuadro(new Torre(Color.negro),false);
    this.selectorPiezas[0][10] = new Cuadro(new Reina(Color.negro),false);
    this.selectorPiezas[0][11] = new Cuadro(new Rey(Color.negro),false);
    this.selectorPiezas[1][0] = new Cuadro(new Pieza(Color.niguno,['🛇','🛇'],TipoPieza.peon),false);
    this.selectorPiezas[1][1] = new Cuadro(new Pieza(Color.niguno,['✓','✓'],TipoPieza.peon),false);
    
}

dibujarTablero(){
  const tema = {
    claro:"#eeeed2",
    oscuro:"#769656",
  }

  let anchoCuadro = Math.round(this.ancho/this.dimension);
  let altoCuadro = Math.round(this.alto/this.dimension);
  const canvasVista = this.canvasRef.nativeElement;
  this.ctx = canvasVista.getContext('2d');
  canvasVista.width = this.ancho;
  canvasVista.height = this.alto;
  this.ctx.font = this.calcularTamanyoFuente(this.dimension);
  for(let x = 0; x < this.dimension; x += 1){
    for(let y = 0; y < this.dimension; y += 1){
      if(this.tablero[x][y].cuadroHabilitado==true){
        let colorCuadro = tema.claro;
        let ejeX = x;
        let ejeY = y;
        if(this.TableroNegro==true){
          ejeX = this.dimension -1 - ejeX;
          ejeY = this.dimension -1 - ejeY;
        }
    
        if((ejeX+ejeY)%2){
          colorCuadro = tema.oscuro;
        }
        this.ctx.fillStyle = colorCuadro;
        const cuadro = this.tablero[x][y];
        if(cuadro.seleccion==true){
          if(colorCuadro == tema.oscuro){
            this.ctx.fillStyle = '#BACA2B';
          }
          if(colorCuadro == tema.claro){
            this.ctx.fillStyle = '#F6F669';
          }
          this.ctx.lineWidth = 8,
          this.ctx.lineJoin = 'bevel';
        }
        this.ctx.fillRect(ejeX * anchoCuadro , ejeY * altoCuadro , anchoCuadro , altoCuadro);
        if(this.tablero[x][y].movimientoPosible){
          this.ctx.fillStyle = '#000000';
          this.ctx.globalAlpha = 0.3,
          this.ctx.beginPath();
          this.ctx.arc(ejeX*anchoCuadro+anchoCuadro/2, 
          ejeY*altoCuadro+altoCuadro/2,12,0,2*Math.PI);
          this.ctx.fill();
          this.ctx.globalAlpha = 1;
        }
        if(this.tablero[x][y].pieza.color == Color.blanco){
          this.ctx.fillStyle = '#ffffff';
          this.ctx.textBaseline = 'middle';
          this.ctx.textAlign = 'center';
          this.ctx.fillText(this.tablero[x][y].pieza.tipo[0],ejeX*anchoCuadro+anchoCuadro/2, 
          ejeY*altoCuadro+altoCuadro/2+0.05*altoCuadro);
          this.ctx.fillStyle = '#111111';
          this.ctx.textBaseline = 'middle';
          this.ctx.textAlign = 'center';
          this.ctx.fillText(this.tablero[x][y].pieza.tipo[1],ejeX*anchoCuadro+anchoCuadro/2, 
          ejeY*altoCuadro+altoCuadro/2+0.05*altoCuadro);
        }
        else{
          this.ctx.fillStyle = '#111111';
          this.ctx.textBaseline = 'middle',
          this.ctx.textAlign = 'center';
          this.ctx.fillText(this.tablero[x][y].pieza.tipo[0],ejeX*anchoCuadro+anchoCuadro/2, 
          ejeY*altoCuadro+altoCuadro/2+0.05*altoCuadro);
          this.ctx.fillStyle = '#333333';
          this.ctx.textBaseline = 'middle';
          this.ctx.textAlign = 'center';
          this.ctx.fillText(this.tablero[x][y].pieza.tipo[1],ejeX*anchoCuadro+anchoCuadro/2, 
          ejeY*altoCuadro+altoCuadro/2+0.05*altoCuadro);
        }
      }
    }
  }

}

dibujarSelector(){
  const tema = {
    claro:"#eeeed2",
    oscuro:"#769656",
  }

  const canvasVista = this.canvasRefPiezas.nativeElement;
  this.ctx2 = canvasVista.getContext('2d');

  canvasVista.width = this.ancho/6;
  canvasVista.height = this.alto;

  let anchoCuadro = canvasVista.width/2;
  let altoCuadro = canvasVista.height/12;

  this.ctx2.font = this.calcularTamanyoFuente(12);

  for(let x = 0; x < 2; x += 1){
    for(let y = 0; y < 12; y += 1){
      if(this.selectorPiezas[x][y].cuadroHabilitado==true){
      let colorCuadro = tema.claro;
      let ejeX = x;
      let ejeY = y;
      if(this.TableroNegro==true){
        ejeX = this.dimension -1 - ejeX;
        ejeY = this.dimension -1 - ejeY;
      }
   
      if((ejeX+ejeY)%2){
        colorCuadro = tema.oscuro;
      }
      this.ctx2.fillStyle = colorCuadro;
      const cuadro = this.selectorPiezas[x][y];
      if(cuadro.seleccion==true){
        if(colorCuadro == tema.oscuro){
          this.ctx2.fillStyle = '#BACA2B';
        }
        if(colorCuadro == tema.claro){
          this.ctx2.fillStyle = '#F6F669';
        }
        this.ctx2.lineWidth = 8,
        this.ctx2.lineJoin = 'bevel';
      }
      this.ctx2.fillRect(ejeX * anchoCuadro , ejeY * altoCuadro , anchoCuadro , altoCuadro);
      if(this.selectorPiezas[x][y].movimientoPosible){
        this.ctx2.fillStyle = '#000000';
        this.ctx2.globalAlpha = 0.3,
        this.ctx2.beginPath();
        this.ctx2.arc(ejeX*anchoCuadro+anchoCuadro/2, 
        ejeY*altoCuadro+altoCuadro/2,12,0,2*Math.PI);
        this.ctx2.fill();
        this.ctx2.globalAlpha = 1;
      }
      if(this.selectorPiezas[x][y].pieza.color == Color.blanco){
        this.ctx2.fillStyle = '#ffffff';
        this.ctx2.textBaseline = 'middle',
        this.ctx2.textAlign = 'center';
        this.ctx2.fillText(this.selectorPiezas[x][y].pieza.tipo[0],ejeX*anchoCuadro+anchoCuadro/2, 
        ejeY*altoCuadro+altoCuadro/2+0.05*altoCuadro);
        this.ctx2.fillStyle = '#111111';
        this.ctx2.textBaseline = 'middle',
        this.ctx2.textAlign = 'center';
        this.ctx2.fillText(this.selectorPiezas[x][y].pieza.tipo[1],ejeX*anchoCuadro+anchoCuadro/2, 
        ejeY*altoCuadro+altoCuadro/2+0.05*altoCuadro);
      }
      else{
        this.ctx2.fillStyle = '#111111';
        this.ctx2.textBaseline = 'middle',
        this.ctx2.textAlign = 'center';
        this.ctx2.fillText(this.selectorPiezas[x][y].pieza.tipo[0],ejeX*anchoCuadro+anchoCuadro/2, 
        ejeY*altoCuadro+altoCuadro/2+0.05*altoCuadro);
        this.ctx2.fillStyle = '#333333';
        this.ctx2.textBaseline = 'middle',
        this.ctx2.textAlign = 'center';
        this.ctx2.fillText(this.selectorPiezas[x][y].pieza.tipo[1],ejeX*anchoCuadro+anchoCuadro/2, 
        ejeY*altoCuadro+altoCuadro/2+0.05*altoCuadro);
      }
    }
    }
  }

  this.setCeldaSeleccionada = this.setCeldaSeleccionada.bind(this);
  this.setCursorCuadro = this.setCursorCuadro.bind(this);
  this.cogerPieza = this.cogerPieza.bind(this);
  this.soltarPieza = this.soltarPieza.bind(this);
}

@HostListener('document:mousedown',['$event'])
CogerPieza = (e:any)=>{
  if(e.target.id == 'canvasID'){
    this.cogerPieza(e);
  }
  if(e.target.id == 'canvasIDPiezas'){
    this.cogerPiezaSelector(e);
  }
}
@HostListener('document:mouseup',['$event'])
SoltarPieza = (e:any)=>{
  if(e.target.id == 'canvasID'){
    this.soltarPieza(e);
  }
  if(e.target.id != 'canvasID'&&this.piezaSeleccionada.tipoPieza!="0"){
    this.soltarPiezaSelector(e);
  }
}

cogerPieza(cursor: MouseEvent){
  if(this.piezaSeleccionada.tipoPieza!="0") return;
  const {offsetX,offsetY}=cursor;
  const [x,y] = this.coordenadasCursor(offsetX,offsetY);
  const celdaSeleccionada = this.tablero[x][y];
  if(celdaSeleccionada.pieza.tipoPieza=="0") return;
  celdaSeleccionada.setSeleccion(true);
  this.piezaSeleccionada = this.tablero[x][y].pieza;
  this.celdaPrevia = [x,y];
  this.dibujarTablero();
}

cogerPiezaSelector(cursor: MouseEvent){
  if(this.piezaSeleccionada.tipoPieza!="0") return;
  const {offsetX,offsetY}=cursor;
  const [x,y] = this.coordenadasCursorSelector(offsetX,offsetY);
  const celdaSeleccionada = this.selectorPiezas[x][y];
  if(celdaSeleccionada.pieza.tipoPieza=="0"&&x==0) return;
  celdaSeleccionada.setSeleccion(true);
  this.piezaSelector = this.selectorPiezas[x][y].pieza;
  this.celdaPrevia = [x,y];
  this.dibujarSelector();
  this.limpiarSelector();
}

soltarPieza(cursor: MouseEvent){
  if(this.piezaSeleccionada.tipoPieza=="0"&&this.piezaSelector.tipoPieza==TipoPieza.ninguna) return;
  
  const {offsetX,offsetY}=cursor;
  const [x,y] = this.coordenadasCursor(offsetX,offsetY);
  const celdaSeleccionada = this.tablero[x][y];
  if(celdaSeleccionada.cuadroHabilitado==false&&this.piezaSelector.tipo[0]!="✓")return;
  const celdaPrevia = this.tablero[this.celdaPrevia[0]][this.celdaPrevia[1]];
  if(this.piezaSelector.tipoPieza==TipoPieza.ninguna){
    if(x==this.celdaPrevia[0]&&y==this.celdaPrevia[1]){
      this.piezaSeleccionada = new Pieza(Color.niguno,["",""],TipoPieza.ninguna);
      this.limpiarTablero(x,y,this.celdaPrevia[0],this.celdaPrevia[1]); 
      this.dibujarTablero();
      return;
    }
    else{
      this.tablero[x][y]=celdaPrevia;
      this.tablero[this.celdaPrevia[0]][this.celdaPrevia[1]]=new Cuadro(new Pieza(Color.niguno,["",""],TipoPieza.ninguna),false);
      this.piezaSeleccionada = new Pieza(Color.niguno,["",""],TipoPieza.ninguna);
      this.limpiarTablero(x,y,this.celdaPrevia[0],this.celdaPrevia[1]); 
      this.dibujarTablero();
    }
  }

  if(this.piezaSelector.tipoPieza!=TipoPieza.ninguna||this.piezaSelector.tipo[0]=="🛇"||this.piezaSelector.tipo[0]=="✓"){
    if(this.piezaSelector.tipo[0]=="🛇"){
      this.tablero[x][y].cuadroHabilitado=false;
      this.piezaSelector = new Pieza(Color.niguno,["",""],TipoPieza.ninguna);
    }
    else if(this.piezaSelector.tipo[0]=="✓"){
      this.tablero[x][y].cuadroHabilitado=true;
      this.piezaSelector = new Pieza(Color.niguno,["",""],TipoPieza.ninguna);
    }
    else{
      this.tablero[x][y].pieza=this.piezaSelector;
      this.piezaSelector = new Pieza(Color.niguno,["",""],TipoPieza.ninguna);
    }   
    this.limpiarSelector(); 
    this.dibujarTablero();
    this.dibujarSelector();
  }
}

soltarPiezaSelector(cursor: MouseEvent){
  const celdaPrevia = this.tablero[this.celdaPrevia[0]][this.celdaPrevia[1]];
  if(this.piezaSeleccionada.tipoPieza=="0") return;
  celdaPrevia.setSeleccion(false);
  this.tablero[this.celdaPrevia[0]][this.celdaPrevia[1]]=new Cuadro(new Pieza(Color.niguno,["",""],TipoPieza.ninguna),false);
  this.piezaSeleccionada = new Pieza(Color.niguno,["",""],TipoPieza.ninguna);
  this.limpiarSelector();
  this.dibujarSelector();
  this.dibujarTablero();
}
 
coordenadasCursor(x: number,y: number){
  let columnas = Math.floor(x/(this.ancho/this.dimension));
  let filas = Math.floor(y/(this.alto/this.dimension));
  if(this.TableroNegro==true){
    columnas = this.dimension -1 - columnas;
    filas = this.dimension -1 - filas;
  }
  return [columnas,filas];
}
coordenadasCursorSelector(x: number,y: number){
  let columnas = Math.floor(x/(this.ancho/12));
  let filas = Math.floor(y/(this.alto/12));
  return [columnas,filas];
}

setCeldaSeleccionada(cursor: MouseEvent){
  const {offsetX,offsetY}=cursor;
  const [x,y] = this.coordenadasCursor(offsetX,offsetY);
  const celdaSeleccionada = this.tablero[x][y];
  celdaSeleccionada.setSeleccion(true);

}
setCursorCuadro(cursor:MouseEvent){
  const {offsetX,offsetY}=cursor;
  const x = Math.floor(offsetX/this.anchoCuadro);
  const y = Math.floor(offsetY/this.altoCuadro);
  const cuadroSeleccionado = this.tablero[x][y];
}


limpiarTablero(ax: number, ay: number, bx: number, by: number) {
  for(let x = 0; x < this.dimension; x += 1){
    for(let y = 0; y < this.dimension; y += 1){
      if((x==ax && y==ay) || (x==bx && y==by)){
        this.tablero[x][y].seleccion=true;
      }
      else{
        this.tablero[x][y].seleccion=false;
      }
    }
  }
}

limpiarSelector() {
  for(let x = 0; x < 2; x += 1){
    for(let y = 0; y < 12; y += 1){
        this.selectorPiezas[x][y].seleccion=false;
    }
  }
  for(let x = 0; x < this.dimension; x += 1){
    for(let y = 0; y < this.dimension; y += 1){
        this.tablero[x][y].seleccion=false;   
    }
  }
}

crearSala(){
  this.salaID=this.formulario.sala;
  this.componerJugada();
  
  //socket.emit('entrar sala',this.situacionTablero,this.salaID);
}

}