import { Pieza } from "../pieza";
import { Color, TipoPieza } from "../tipos";
import { Cuadro } from "../cuadro";

export class Alfil extends Pieza{
    constructor(color: Color){
        super(color, ['♝','♗'], TipoPieza.alfil);
    }

    override movimientosPosibles(posicion: [number, number], tablero: Cuadro[][]) {
        this.comprobarDireccion(posicion,[1,1],tablero);
        this.comprobarDireccion(posicion,[1,-1],tablero);
        this.comprobarDireccion(posicion,[-1,1],tablero);
        this.comprobarDireccion(posicion,[-1,-1],tablero);
    }
}
