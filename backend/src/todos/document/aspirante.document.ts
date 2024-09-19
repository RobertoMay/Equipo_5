export class AspiranteDocument {
    static collectionName = 'Aspirantes'; // Nombre de la colección en Firestore
  
    id: string;
    nombresCompletos: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    curp: string;
    correo: string;
  
    constructor(partial: Partial<AspiranteDocument>) {
      Object.assign(this, partial);
    }
  }
  