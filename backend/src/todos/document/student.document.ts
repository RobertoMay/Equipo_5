export class StudentDocument {
  static collectionName = 'Students';

  id: string; // ID del estudiante
  aspiranteId: string; // ID del aspirante
  firstName: string; // Nombres
  lastName: string; // Apellido paterno
  middleName: string; // Apellido materno
  curp: string; // CURP
  email: string; // Correo electrónico
  enrollmentPeriod: string; // Periodo de inscripción
  documents: {
    name: string;
    link: string;
    status: 'accepted' | 'rejected' | 'pending'; // Estado del documento
  }[]; // Documentos subidos
  isEnrolled: boolean; // Si el alumno está inscrito o no

  constructor(partial: Partial<StudentDocument>) {
    Object.assign(this, partial);
  }
}
