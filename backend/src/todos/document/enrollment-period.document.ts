export class EnrollmentPeriodDocument {
    static collectionName = 'EnrollmentPeriods'; // Nombre de la colección en Firestore
  
    id: string; // ID del periodo de inscripción
    startDate: Date; // Fecha de inicio del periodo
    endDate: Date; // Fecha de cierre del periodo
    isOpen: boolean; // Estado de la inscripción (true o false)
  
    constructor(partial: Partial<EnrollmentPeriodDocument>) {
      Object.assign(this, partial);
    }
  }
  