import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import { EnrollmentPeriodDocument } from '../todos/document/enrollment-period.document';

@Injectable()
export class EnrollmentPeriodService {
  private firestore: Firestore;

  constructor() {
    this.firestore = new Firestore();
  }

  // Obtener el periodo de inscripción actual
  async getEnrollmentPeriod(): Promise<EnrollmentPeriodDocument> {
    const snapshot = await this.firestore.collection(EnrollmentPeriodDocument.collectionName).limit(1).get();

    if (snapshot.empty) {
      throw new HttpException('No enrollment period found', HttpStatus.NOT_FOUND);
    }

    const period = snapshot.docs[0].data() as EnrollmentPeriodDocument;
    return this.calculateEnrollmentStatus(period);
  }

  // Obtener todas las fechas registradas
  async getAllEnrollmentPeriods(): Promise<EnrollmentPeriodDocument[]> {
    const snapshot = await this.firestore.collection(EnrollmentPeriodDocument.collectionName).get();
    if (snapshot.empty) {
      throw new HttpException('No enrollment periods found', HttpStatus.NOT_FOUND);
    }

    const periods: EnrollmentPeriodDocument[] = [];
    snapshot.forEach(doc => {
      const period = doc.data() as EnrollmentPeriodDocument;
      periods.push(this.calculateEnrollmentStatus(period));
    });

    return periods;
  }

  // Crear o actualizar el periodo de inscripción
  async saveEnrollmentPeriod(data: Partial<EnrollmentPeriodDocument>): Promise<EnrollmentPeriodDocument> {
    const { startDate, endDate } = data;

    if (!startDate || !endDate) {
      throw new HttpException('Start date and end date are required', HttpStatus.BAD_REQUEST);
    }

    // Validar que la fecha de inicio no sea mayor que la fecha de cierre
    if (new Date(startDate) > new Date(endDate)) {
      throw new HttpException('Start date cannot be greater than end date', HttpStatus.BAD_REQUEST);
    }

    const enrollmentPeriod = {
      ...data,
      id: this.firestore.collection(EnrollmentPeriodDocument.collectionName).doc().id,
      isOpen: false, // Se calcula después
    } as EnrollmentPeriodDocument;

    await this.firestore.collection(EnrollmentPeriodDocument.collectionName).doc(enrollmentPeriod.id).set(enrollmentPeriod);
    return this.calculateEnrollmentStatus(enrollmentPeriod);
  }

  // Actualizar un periodo de inscripción por ID
  async updateEnrollmentPeriod(id: string, data: Partial<EnrollmentPeriodDocument>): Promise<EnrollmentPeriodDocument> {
    const docRef = this.firestore.collection(EnrollmentPeriodDocument.collectionName).doc(id);

    const doc = await docRef.get();
    if (!doc.exists) {
      throw new HttpException('Enrollment period not found', HttpStatus.NOT_FOUND);
    }

    await docRef.update(data);
    const updatedPeriod = (await docRef.get()).data() as EnrollmentPeriodDocument;
    return this.calculateEnrollmentStatus(updatedPeriod);
  }

  // Eliminar un periodo de inscripción por ID
  async deleteEnrollmentPeriod(id: string): Promise<void> {
    const docRef = this.firestore.collection(EnrollmentPeriodDocument.collectionName).doc(id);

    const doc = await docRef.get();
    if (!doc.exists) {
      throw new HttpException('Enrollment period not found', HttpStatus.NOT_FOUND);
    }

    await docRef.delete();
  }

  // Calcular si el periodo de inscripción está abierto o cerrado
  private calculateEnrollmentStatus(period: EnrollmentPeriodDocument): EnrollmentPeriodDocument {
    const now = new Date();
    period.isOpen = now >= new Date(period.startDate) && now <= new Date(period.endDate);
    return period;
  }
}
