import { Pieza } from "../pieza";
import { Color, TipoPieza } from "../tipos";
import { Cuadro } from "../cuadro";

export class Peon extends Pieza{
    constructor(color: Color){
        super(color, ['♟','♙'], TipoPieza.peon);
    }

    override movimientosPosibles(posicion: [number, number], tablero: Cuadro[][]) {
        const [x, y] = posicion;
        if(y>=2&&y<=tablero.length-3){
            for(let i = 1; i <= (this.primerMovimiento ? 1 : 2); i++){            
                const CeldaPosible = tablero[x][this.color == Color.negro ? y + i : y - i];
                if(CeldaPosible.pieza.tipoPieza!='0'){
                    break;
                }
                CeldaPosible.setMovimientoPosible(true);
            }
        }
        if(y>=1&&y<=tablero.length-2){
            const CeldaPosible = tablero[x][this.color == Color.negro ? y + 1 : y - 1];
            if(CeldaPosible.pieza.tipoPieza=='0'){
                CeldaPosible.setMovimientoPosible(true);
            }
        }
        
        const comerPiezaderecha = this.obtenerCelda([x+1,this.color == Color.negro ? y + 1 : y - 1],tablero)
        if(comerPiezaderecha && comerPiezaderecha.pieza.color && comerPiezaderecha.pieza.color!=this.color)
        comerPiezaderecha.setMovimientoPosible(true);
        const comerPiezaIzquierda = this.obtenerCelda([x-1,this.color == Color.negro ? y + 1 : y - 1],tablero)
        if(comerPiezaIzquierda && comerPiezaIzquierda.pieza.color  && comerPiezaIzquierda.pieza.color!=this.color)
        comerPiezaIzquierda.setMovimientoPosible(true);
    }
        
}