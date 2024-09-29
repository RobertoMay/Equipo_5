export class ConvocatoriaDocument {
  static collectionName = 'Convocatoria';
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  status: boolean;

  constructor(partial: Partial<ConvocatoriaDocument>) {
    Object.assign(this, partial);
  }
}
