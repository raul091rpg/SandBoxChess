import { Pieza } from "../pieza";
import { Color, TipoPieza } from "../tipos";
import { Cuadro } from "../cuadro";

export class Torre extends Pieza{
    constructor(color: Color){
        super(color, ['♜','♖'], TipoPieza.torre);
    }

    override movimientosPosibles(posicion: [number, number], tablero: Cuadro[][]) {
        this.comprobarDireccion(posicion,[1,0],tablero);
        this.comprobarDireccion(posicion,[0,-1],tablero);
        this.comprobarDireccion(posicion,[-1,0],tablero);
        this.comprobarDireccion(posicion,[0,1],tablero);
    }
}