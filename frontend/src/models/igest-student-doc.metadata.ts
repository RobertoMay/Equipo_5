// models/igestsudentdocument.metadata.ts
import { IBaseModel } from '@shared/base-model';

export interface IGestStudentDocument extends IBaseModel {
    id?: string;  // Ahora tiene la propiedad id opcional, requerida por IBaseModel
    name: string;
    type: string;
    link: string;
    date: Date;
    status: 'approved' | 'rejected' | 'pending';
    role: 'student' | 'tutor'; // Identifica si es un documento del estudiante o del tutor 
    iconStatus?: string; // Propiedad opcional para el ícono de estado (por ejemplo, 'approved' o 'rejected')
  }
  