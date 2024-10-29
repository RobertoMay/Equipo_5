export class ConvocatoriaDocument {
  static collectionName = 'Convocatoria';
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  status: boolean;
  cupo: number; // Cupo total
  availableCupo: number; // Cupo disponible
  occupiedCupo: number; // Cupo ocupado

  constructor(partial: Partial<ConvocatoriaDocument>) {
    Object.assign(this, partial);
  }
}
