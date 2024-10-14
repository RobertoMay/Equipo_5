export class StudentDocDocument {
  static collectionName = 'StudentDocDocument';
  id: string;
  aspiranteCurp: string;
  Documents: {
    name: string;
    link: string;
    status: 'accepted' | 'rejected' | 'pending'; // Estado del documento
  }[];

  constructor(partial: Partial<StudentDocDocument>) {
    Object.assign(this, partial);
  }
}
