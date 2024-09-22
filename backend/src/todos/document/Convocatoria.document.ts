export class ConvocatoriaDocument {
  static collectionName = 'Convocatoria';
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  status: boolean;
}
