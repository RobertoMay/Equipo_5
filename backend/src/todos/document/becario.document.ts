export class BecarioDocument {
    static collectionName = 'Becarios'; 
  
    id: string;
    nombresCompletos: string; 
    apellidoPaterno: string;
    apellidoMaterno: string;
    curp: string;
    correo: string;
    esAdministrador?: boolean; 
  
    constructor(partial: Partial<BecarioDocument>) {
      Object.assign(this, partial);
    }
  }
  