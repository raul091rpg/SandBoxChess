import { Pieza } from "../pieza";
import { Color, TipoPieza } from "../tipos";
import { Cuadro } from "../cuadro";

export class Reina extends Pieza{
    constructor(color: Color){
        super(color, ['♛','♕'], TipoPieza.reina);
    }

    override movimientosPosibles(posicion: [number, number], tablero: Cuadro[][]) {
        this.comprobarDireccion(posicion,[1,1],tablero);
        this.comprobarDireccion(posicion,[1,-1],tablero);
        this.comprobarDireccion(posicion,[-1,1],tablero);
        this.comprobarDireccion(posicion,[-1,-1],tablero);
        this.comprobarDireccion(posicion,[1,0],tablero);
        this.comprobarDireccion(posicion,[0,-1],tablero);
        this.comprobarDireccion(posicion,[-1,0],tablero);
        this.comprobarDireccion(posicion,[0,1],tablero);
    }
}