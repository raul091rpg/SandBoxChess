import { Pieza } from "../pieza";
import { Color, TipoPieza } from "../tipos";
import { Cuadro } from "../cuadro";

export class Caballo extends Pieza{
    constructor(color: Color){
        super(color, ['♞','♘'], TipoPieza.caballo);
    }

    override movimientosPosibles(posicion: [number, number], tablero: Cuadro[][]) {
        const [x, y] = posicion;

        const movimientoPosible: [number,number][]=[
            [x-1,y-2],
            [x-1,y+2],
            [x+1,y-2],
            [x+1,y+2],
            [x-2,y-1],
            [x-2,y+1],
            [x+2,y-1],
            [x+2,y+1],
        ];

        movimientoPosible.forEach((set)=>{
            const CeldaPosible = this.obtenerCelda(set, tablero);
            if(CeldaPosible && CeldaPosible.pieza.color!=this.color){
                CeldaPosible.setMovimientoPosible(true);
            }
        });
    }
}