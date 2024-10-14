export class HojasInscripcionDocument {
  static collectionName = 'HojasInscripcion';
  id: string;
  id_Aspirante: string;
  curpAspirante: string;
  dateGenerated: Date;
  url_pdf: string;

  constructor(partial: Partial<HojasInscripcionDocument>) {
    Object.assign(this, partial);
  }
}
