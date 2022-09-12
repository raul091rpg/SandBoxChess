import { Pieza } from "./pieza";

export class Cuadro {

    pieza: Pieza;
    seleccion: boolean;
    movimientoPosible: boolean;
    cuadroHabilitado:boolean;

    constructor(pieza: Pieza, seleccion: boolean){
        this.pieza = pieza;
        this.seleccion = seleccion;
        this.movimientoPosible = false;
        this.cuadroHabilitado = true;
    }

    setSeleccion(seleccion: boolean){
        this.seleccion = seleccion;
    }

    setPieza(pieza : Pieza){
        this.pieza = pieza;
    }

    setMovimientoPosible(movimientoPosible : boolean){
        this.movimientoPosible = movimientoPosible;
    }

}
