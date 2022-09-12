import { TemplateLiteral } from '@angular/compiler';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit,HostListener, Input,Inject } from '@angular/core';
import { inject } from '@angular/core/testing';
import { Color, Tema, TipoPieza, TipoPiezaConfiguracion } from 'src/app/clases/tipos';
import { Cuadro } from '../../clases/cuadro';
import { Pieza } from '../../clases/pieza';
import { Peon } from 'src/app/clases/piezas/Peon';
import { Caballo } from 'src/app/clases/piezas/Caballo';
import { Alfil } from 'src/app/clases/piezas/Alfil';
import { Torre } from 'src/app/clases/piezas/Torre';
import { Reina } from 'src/app/clases/piezas/Reina';
import { Rey } from 'src/app/clases/piezas/Rey';
import {Router} from '@angular/router';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-tablero',
  templateUrl: './tablero.component.html',
  styleUrls: ['./tablero.component.css'],
  template: '<canvas #canvasRef></canvas>'
})

export class TableroComponent implements OnInit,AfterViewInit {

  socket = io('https://serene-gorge-90320.herokuapp.com/');
  
  @Input() salaID:string|null=null;
  @Input() situacionTablero:string|null=null;
  habilitado = false;
  //salaID = location.search.split('sala=')[1];
  contadorSoltar:number=0;
  contadorCojer:number=0;
  ContadorDibujar:number=0;
  ancho: number = 600;
  alto: number = 600;
  dimension:number = 8;
  tablero : Cuadro[][] = [[]];
  anchoCuadro: number = Math.round(this.ancho/this.dimension);
  altoCuadro: number = Math.round(this.alto/this.dimension);
  ajusteAlto: number = 0.05 * this.alto;
  temaPieza: Tema | undefined;
  celdaSeleccionada : number[] = [];
  celdaPrevia : number [] = [];
  celdaPreviaXY :  [number, number] = [0,0];
  piezaSeleccionada : Pieza = new Pieza(Color.niguno,[""],TipoPieza.ninguna);
  TableroNegro : boolean = false;
  cadenasFen: string[]=[];
  letrasPosibles:string='rnbqkbnrpPRNBQKBNR';
  fen:string='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
  tableroAux : string[][] = [[]];
  peonCoronado:boolean=false;

  @ViewChild('canvasRef', {static: false}) canvasRef: any;
  private ctx!: CanvasRenderingContext2D;
  
  formulario={
    sala:'',
    coronacion:'',
  }
  
  constructor(private router:Router) {
  }


  ngOnInit() {
    this.ponerParametros();
    this.crearTablero();
  }

  ngAfterViewInit(): void {
      this.rellenarPiezas();
  }

  calcularTamanyoFuente(cuadros:number):string{
    var resultado:string="";
    var aux:number=Math.round((this.ancho/cuadros)*0.80);
    resultado="400 "+aux.toString()+"px Arial";
    return resultado;
  }

  ponerParametros(){
    if(this.situacionTablero){
      this.dimension=1;
      for(let i=0;i<this.situacionTablero.split('+')[0].length;i++){
        if(this.situacionTablero[i]=='/')
        this.dimension+=1;
      }
      this.fen=this.situacionTablero.split('+')[0];
    }
  }

  crearTablero(): void{
    if(this.situacionTablero){
      this.tablero = [];
      for(let x = 0; x < this.dimension; x += 1){
        this.tablero[x]=[];
        for(let y = 0; y < this.dimension; y += 1){
          this.tablero[x][y] = new Cuadro(new Pieza(Color.niguno,["",""],TipoPieza.ninguna),false) ;
        }
      }
      this.socket.on('conectado',()=>{
        this.socket.emit('crear sala',this.salaID,this.situacionTablero);
      });
    }
  }

  unirseSala(){
    this.salaID=this.formulario.sala;
    this.socket.emit('unir sala',this.salaID);
  }

  rellenarPiezas(){
    this.socket.on('iniciarTablero',(piezasServidor)=>{
      if(!this.situacionTablero){
        this.situacionTablero=piezasServidor;
        this.ponerParametros();
        this.crearTablero();
      }
      this.comprobarFen(piezasServidor);
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
          //10pp/pp8pp/12/12/12/12/12/12/12/12/12/12
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

    //habilitar y deshabilitar cuadros
    
      let cuadrosHabilitados=piezasServidor.split('+')[1];
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
    

    this.dibujarTablero();
    });
    
    this.socket.on('moverPiezasTablero',(anteriorX,anteriorY,siguienteX,siguienteY)=>{
      
    if(this.tablero[anteriorX][anteriorY].pieza.tipoPieza==TipoPieza.rey){
      
      if(siguienteX==anteriorX+2){
        
        this.tablero[siguienteX-1][siguienteY].setPieza(this.tablero[siguienteX+1][siguienteY].pieza);      
        this.tablero[siguienteX-1][siguienteY].setSeleccion(true);
        this.tablero[siguienteX-1][siguienteY].pieza.primerMovimiento=true;
        this.tablero[siguienteX+1][siguienteY].pieza=new Pieza(Color.niguno,["",""],TipoPieza.ninguna);
        this.tablero[siguienteX+1][siguienteY].setSeleccion(false);
      }
      else if(siguienteX==anteriorX-2){
        
        this.tablero[siguienteX+1][siguienteY].setPieza(this.tablero[siguienteX-2][siguienteY].pieza);      
        this.tablero[siguienteX+1][siguienteY].setSeleccion(true);
        this.tablero[siguienteX+1][siguienteY].pieza.primerMovimiento=true;
        this.tablero[siguienteX-2][siguienteY].pieza=new Pieza(Color.niguno,["",""],TipoPieza.ninguna);
        this.tablero[siguienteX-2][siguienteY].setSeleccion(false);
      }
    }

    let piezaTomada=this.tablero[siguienteX][siguienteY].pieza;
      
    this.tablero[siguienteX][siguienteY].setPieza(this.tablero[anteriorX][anteriorY].pieza);
    this.tablero[siguienteX][siguienteY].setSeleccion(true);
    this.tablero[siguienteX][siguienteY].pieza.primerMovimiento=true;
    this.tablero[anteriorX][anteriorY].pieza=new Pieza(Color.niguno,["",""],TipoPieza.ninguna);
    this.tablero[anteriorX][anteriorY].setSeleccion(false);
    this.limpiarTableroMovimientos(anteriorX,anteriorY,siguienteX,siguienteY);
    this.habilitado = false;
    this.dibujarTablero();
    if(piezaTomada.tipoPieza==TipoPieza.rey){
      this.declararGanador();
    }
    if(this.tablero[siguienteX][siguienteY].pieza.tipoPieza==TipoPieza.peon&&(siguienteY==0||siguienteY==this.dimension-1)){
      if(this.TableroNegro&&this.tablero[siguienteX][siguienteY].pieza.color==Color.negro)
      this.peonCoronado=true;
      else if(!this.TableroNegro&&this.tablero[siguienteX][siguienteY].pieza.color==Color.blanco)
      this.peonCoronado=true;
    }

    });


    this.socket.on('coronar peon',(piezaRemplazar)=>{
      for(let i=0;i<this.tablero.length;i++){
        for(let j=0;j<this.tablero.length;j++){
          if(j==0||j==this.tablero.length-1){
            if(this.tablero[i][j].pieza.tipoPieza==TipoPieza.peon){
              let color = this.tablero[i][j].pieza.color;
              if(piezaRemplazar==TipoPieza.caballo)this.tablero[i][j].pieza=new Caballo(color);
              else if(piezaRemplazar==TipoPieza.alfil)this.tablero[i][j].pieza=new Alfil(color);
              else if(piezaRemplazar==TipoPieza.torre)this.tablero[i][j].pieza=new Torre(color);
              else if(piezaRemplazar==TipoPieza.reina)this.tablero[i][j].pieza=new Reina(color);
              
            }
          }
        }
      }
    this.peonCoronado=false;
    this.dibujarTablero();
    });
    
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
        alert("código FEN dimension distinta");
        return false;
      }
    }
    valido = true;
    return valido;
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

    this.setCeldaSeleccionada = this.setCeldaSeleccionada.bind(this);
    this.cogerPieza = this.cogerPieza.bind(this);
    this.soltarPieza = this.soltarPieza.bind(this);
    //this.movimientoSocket = this.movimientoSocket.bind(this);
    this.teTocaSocket = this.teTocaSocket.bind(this);
    this.eresNegroSocket = this.eresNegroSocket.bind(this);
    this.declararGanador = this.declararGanador.bind(this);

    this.socket.on('tu turno',this.teTocaSocket);
    this.socket.on('eres negro',this.eresNegroSocket);
    this.socket.on('jugador abandono',this.declararGanador);
    
  }

  @HostListener('document:mousedown',['$event'])
  CogerPieza = (e:any)=>{
    if(e.target.id == 'canvasID'){
      this.cogerPieza(e);
    }
  }
  @HostListener('document:mouseup',['$event'])
  SoltarPieza = (e:any)=>{
    if(e.target.id == 'canvasID'){
      this.soltarPieza(e);
    }
  }

  cogerPieza(cursor: MouseEvent){
    if(this.habilitado==false)return;
    if(this.piezaSeleccionada.tipoPieza!="0") return;
    const {offsetX,offsetY}=cursor;
    const [x,y] = this.coordenadasCursor(offsetX,offsetY);
    console.log(x,y);
    const celdaSeleccionada = this.tablero[x][y];
    if(celdaSeleccionada.pieza.tipoPieza=="0") return;
    if(this.TableroNegro && celdaSeleccionada.pieza.color == Color.blanco)return;
    if(!this.TableroNegro && celdaSeleccionada.pieza.color == Color.negro)return;
    celdaSeleccionada.pieza.movimientosPosibles([x,y],this.tablero);
    this.piezaSeleccionada = this.tablero[x][y].pieza;
    celdaSeleccionada.setSeleccion(true);
    this.celdaPreviaXY = [x,y];
    this.celdaPrevia = [x,y];
    this.dibujarTablero();
    this.contadorCojer=this.contadorCojer+1;
  }

  soltarPieza(cursor: MouseEvent){
    const celdaPrevia = this.tablero[this.celdaPrevia[0]][this.celdaPrevia[1]];
    if(this.piezaSeleccionada.tipoPieza=="0") return;
    const {offsetX,offsetY}=cursor;
    const [x,y] = this.coordenadasCursor(offsetX,offsetY);
    if(this.tablero[x][y].cuadroHabilitado==false)return;
    const celdaSeleccionada = this.tablero[x][y];
    if(x==this.celdaPrevia[0]&&y==this.celdaPrevia[1]){
      this.piezaSeleccionada = new Pieza(Color.niguno,["",""],TipoPieza.ninguna);
      this.limpiarTablero(x,y,this.celdaPrevia[0],this.celdaPrevia[1]); 
      this.limpiarTableroMovimientos(x,y,this.celdaPrevia[0],this.celdaPrevia[1]);
      this.dibujarTablero();
      return;
    }
    if(!celdaSeleccionada.movimientoPosible){
      this.piezaSeleccionada = new Pieza(Color.niguno,["",""],TipoPieza.ninguna);
      this.tablero[x][y].seleccion=false;
      this.dibujarTablero();
      this.limpiarTableroMovimientos(x,y,this.celdaPrevia[0],this.celdaPrevia[1]);
      return;
    }

      this.dibujarTablero();
      this.socket.emit('mover',[this.celdaPreviaXY[0],this.celdaPreviaXY[1],x,y]);
  }

  teTocaSocket(){
    this.habilitado=true;
  }

  eresNegroSocket(){
    this.TableroNegro=true;
    this.habilitado=false;
    this.dibujarTablero();
  }

  declararGanador(){
    this.router.navigate(['/ganador']);
  }

 
  coordenadasCursor(x: number,y: number){
    let columnas = Math.floor(x/(this.ancho/this.dimension));
    let filas = Math.floor(y/(this.ancho/this.dimension));
    if(this.TableroNegro==true){
      columnas = this.dimension -1 - columnas;
      filas = this.dimension -1 - filas;
    }
    return [columnas,filas];
  }

  setCeldaSeleccionada(cursor: MouseEvent){
    const {offsetX,offsetY}=cursor;
    const [x,y] = this.coordenadasCursor(offsetX,offsetY);
    const celdaSeleccionada = this.tablero[x][y];
    celdaSeleccionada.setSeleccion(true);
    
  }



  setCuadro(x:number,y:number,pieza: Pieza){
    this.tablero[x][y].pieza=pieza;
  }

  elegirJugador(jugador:string){
    if(jugador=="blancas"){
      this.TableroNegro=false;
    }
    else{
      this.TableroNegro=true;
    }
    this.dibujarTablero();
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

  limpiarTableroMovimientos(ax: number, ay: number, bx: number, by: number) {
    for(let x = 0; x < this.dimension; x += 1){
      for(let y = 0; y < this.dimension; y += 1){
        if((x==ax && y==ay) || (x==bx && y==by)){
          this.tablero[x][y].seleccion=true;
        }
        else{
          this.tablero[x][y].seleccion=false;
        }
        this.tablero[x][y].movimientoPosible=false;
      }
    }
  }

  intercambiarPeon(pieza:string){
    this.socket.emit('coronacion',pieza);
  }

}

