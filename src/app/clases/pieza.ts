import { Color,TipoPieza } from "./tipos";
import { Cuadro } from "./cuadro";
import { TableroComponent } from "../components/tablero/tablero.component";

export class Pieza {
    color: Color;
    tipoPieza: TipoPieza;
    tipo: string [];
    primerMovimiento: boolean=false;

    constructor(color:Color,tipo: string[],tipoPieza: TipoPieza){
        this.color=color;
        this.tipo=tipo;
        this.tipoPieza=tipoPieza;
    }

    obtenerCelda(posicion: [number, number], tablero: Cuadro[][]): Cuadro | null{
        const [x,y] = posicion;
        const filas = tablero[x]||[];
        const celda =  filas[y];
        return celda;
    }

    comprobarDireccion(posicion: [number, number],direccion: [number, number],tablero: Cuadro[][]){
        const[x,y]=posicion;
        const[xDir,yDir]=direccion;
        for(let i = 1; i<=tablero.length;i++){
            const CeldaPosible = this.obtenerCelda([x+(i*xDir),y+(i*yDir)],tablero);
            if(CeldaPosible){
                if(CeldaPosible.pieza.color==this.color)break;
                CeldaPosible.setMovimientoPosible(true);    
                if(CeldaPosible.pieza.tipoPieza!='0')break;
                CeldaPosible.setMovimientoPosible(true); 
            }
        }
    }

    movimientosPosibles(posicion: [number, number], tablero: Cuadro[][]) {
    }
}