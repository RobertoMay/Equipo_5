import { IBaseModel } from '@shared/base-model'; // Asegúrate de que la ruta sea correcta

// Definición de la interfaz para los documentos del estudiante
export interface StudentDocument {
  name: string;
  type: string;
  link: string;
  date: Date;
  status: 'uploaded' | 'approved' | 'pending' | 'rejected'; // Estado del documento
}

// Definición del modelo para la colección 'StudentDocDocument' en el front-end
export class IStudentDocDocument implements IBaseModel {
  id?: string; // Parte de IBaseModel
  aspiranteId!: string; // ID del aspirante
  name!: string; // Primer nombre
  lastName1!: string; // Primer apellido
  lastName2!: string; // Segundo apellido
  email!: string;
  curp!: string;
  enrollmentPeriod!: string; // Periodo de inscripción
  enrollmentStatus!: boolean; // Estado de inscripción
  Documents?: StudentDocument[]; // Array de documentos relacionados con el estudiante

  constructor(partial: Partial<IStudentDocDocument>) {
    Object.assign(this, partial);
  }
}
