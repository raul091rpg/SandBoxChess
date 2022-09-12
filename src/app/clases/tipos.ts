export interface Tema {
    claro: string,
    oscuro: string,
  }
  
  export enum Color {
    niguno = '',
    blanco = 'blanco',
    negro = 'negro',
  }
  
  export enum TipoPieza {
    ninguna = '0',
    rey = 'k',
    reina = 'q',
    torre = 'r',
    alfil = 'b',
    caballo = 'n',
    peon = '',
  }

  export enum TipoPiezaConfiguracion {
    ninguna = '',
    reyN = 'k',
    reinaN = 'q',
    torreN = 'r',
    alfilN = 'b',
    caballoN = 'n',
    peonN = 'p',
    reyB = 'K',
    reinaB = 'Q',
    torreB = 'R',
    alfilB = 'B',
    caballoB = 'N',
    peonB = 'P',
  }
  