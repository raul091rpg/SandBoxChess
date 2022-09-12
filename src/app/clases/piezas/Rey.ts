import { Pieza } from "../pieza";
import { Color, TipoPieza } from "../tipos";
import { Cuadro } from "../cuadro";

export class Rey extends Pieza{
    constructor(color: Color){
        super(color, ['♚','♔'], TipoPieza.rey);
    }

    override movimientosPosibles(posicion: [number, number], tablero: Cuadro[][]) {
        const [x, y] = posicion;

        const movimientoPosible: [number,number][]=[
            [x+1,y],
            [x-1,y],
            [x,y+1],
            [x,y-1],
            [x+1,y+1],
            [x+1,y-1],
            [x-1,y+1],
            [x-1,y-1],
        ];

        movimientoPosible.forEach((set)=>{
            const CeldaPosible = this.obtenerCelda(set, tablero);
            if(CeldaPosible && CeldaPosible.pieza.color!=this.color){
                CeldaPosible.setMovimientoPosible(true);
            }
        });

        if(this.primerMovimiento)return;

        const celdaEnrroqueRey1 = this.obtenerCelda([x+1,y],tablero);
        const celdaEnrroqueRey2 = this.obtenerCelda([x+2,y],tablero);
        const celdaEnrroqueRey3 = this.obtenerCelda([x+3,y],tablero);
        const celdaEnrroqueReina1 = this.obtenerCelda([x-1,y],tablero);
        const celdaEnrroqueReina2 = this.obtenerCelda([x-2,y],tablero);
        const celdaEnrroqueReina3 = this.obtenerCelda([x-3,y],tablero);
        const celdaEnrroqueReina4 = this.obtenerCelda([x-4,y],tablero);

        if(celdaEnrroqueRey1
            &&celdaEnrroqueRey2
            &&celdaEnrroqueRey3
            &&celdaEnrroqueRey3.pieza.tipoPieza==TipoPieza.torre 
            && !celdaEnrroqueRey3.pieza.primerMovimiento
        ){
            celdaEnrroqueRey2.setMovimientoPosible(true);
        }

        if(celdaEnrroqueReina1
            &&celdaEnrroqueReina2
            &&celdaEnrroqueReina3
            &&celdaEnrroqueReina4
            &&celdaEnrroqueReina4.pieza.tipoPieza==TipoPieza.torre 
            && !celdaEnrroqueReina4.pieza.primerMovimiento
        ){
            celdaEnrroqueReina2.setMovimientoPosible(true);
        }
    }

    enroque(posicion: [number,number]){
        const [x,y]= posicion;
        let enroque = false;
        if(y==7){
            if(x==6 || x==2)
            enroque=true;
        }
        if(y==0){
            if(x==6 || x==2)
            enroque=true;
        }
        return enroque;
    }

    enrocar(posicion: [number,number],tablero: Cuadro[][]){
        const [x,y]= posicion;
        if(y==7){
            if(x==6){
                const celdaTorre = tablero[tablero.length-1][tablero.length-1];
                tablero[tablero.length-3][tablero.length-1].setPieza(celdaTorre.pieza);
                celdaTorre.setPieza(new Pieza(Color.niguno,["",""],TipoPieza.ninguna))
            }
            if(x==2){
                const celdaTorre = tablero[0][tablero.length-1];
                tablero[3][tablero.length-1].setPieza(celdaTorre.pieza);
                celdaTorre.setPieza(new Pieza(Color.niguno,["",""],TipoPieza.ninguna))
            }
        }
        if(y==0){
            if(x==6){
                const celdaTorre = tablero[tablero.length-1][0];
                tablero[tablero.length-3][0].setPieza(celdaTorre.pieza);
                celdaTorre.setPieza(new Pieza(Color.niguno,["",""],TipoPieza.ninguna))
            }
            if(x==2){
                const celdaTorre = tablero[0][0];
                tablero[3][0].setPieza(celdaTorre.pieza);
                celdaTorre.setPieza(new Pieza(Color.niguno,["",""],TipoPieza.ninguna))
            }
        }
    }
}