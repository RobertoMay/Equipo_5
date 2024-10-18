export class StudentDocDocument {
  static collectionName = 'StudentDocDocument';
  id: string;
  aspiranteId: string;
  name: string;
  lastName1: string;
  lastName2: string;
  enrollmentPeriod: string;
  enrollmentStatus: boolean;
  Documents: {
    name: string;
    type: string;
    link: string;
    date: Date;
    status: 'accepted' | 'rejected' | 'pending'; // Estado del documento
  }[];

  constructor(partial: Partial<StudentDocDocument>) {
    Object.assign(this, partial);
  }
}
