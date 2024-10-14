export class AspiranteDocument {
  static collectionName = 'Aspirantes'; 

  id: string;
  nombresCompletos: string; 
  apellidoPaterno: string;
  apellidoMaterno: string;
  curp: string;
  correo: string;
  esAdministrador?: boolean; 
  periodoinscripcion?: string;
  statusinscripcion?: boolean;

  constructor(partial: Partial<AspiranteDocument>) {
    Object.assign(this, partial);
  }
}
