export class Aspirante {
    id: string; // Hashed ID
    nombresCompletos: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    curp: string;
    correo: string;
  
    constructor(partial: Partial<Aspirante>) {
      Object.assign(this, partial);
    }
  }
  