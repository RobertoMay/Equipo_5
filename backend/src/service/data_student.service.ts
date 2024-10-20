import { Injectable, NotFoundException } from '@nestjs/common';
import { GenericService } from '../shared/generic.service'; // Ajusta el path según tu estructura
import { DataStudent } from 'src/todos/document/data_student.document';

@Injectable()
export class DataStudentService extends GenericService<DataStudent> {
  constructor() {
    super(DataStudent.collectionName); // Usando la colección definida en el documento
  }

  async findByAspiranteId(aspiranteId: string): Promise<DataStudent> {
    try {
      // Realiza la consulta a Firestore
      const snapshot = await this.firestore
        .collection(this.collectionName)
        .where('aspiranteId', '==', aspiranteId)
        .limit(1)
        .get();

      if (snapshot.empty) {
        // Lanzar excepción si no se encuentra ningún documento
        throw new NotFoundException(
          `No se encontró ningún documento para el aspiranteId: ${aspiranteId}`,
        );
      }

      const doc = snapshot.docs[0];
      return doc.data() as DataStudent; // Retornar el documento encontrado como DataStudent
    } catch (error) {
      // Manejo de errores en caso de que ocurra algún problema en la consulta
      console.error('Error al buscar DataStudent por aspiranteId:', error);
      throw new Error('Error al buscar el documento del estudiante'); // Lanzar una excepción genérica
    }
  }
  
  async getAspiranteId(aspiranteId: string): Promise<string> {
    try {
      // Realiza la consulta a Firestore
      const snapshot = await this.firestore
        .collection(this.collectionName)
        .where('aspiranteId', '==', aspiranteId)
        .limit(1)
        .get();

      if (snapshot.empty) {
        // Lanzar excepción si no se encuentra ningún documento
        throw new NotFoundException(
          `No se encontró ningún documento para el aspiranteId: ${aspiranteId}`,
        );
      }

      // Retornar solo el aspiranteId encontrado
      const doc = snapshot.docs[0];
      const data = doc.data() as DataStudent;
      return data.aspiranteId;
    } catch (error) {
      // Manejo de errores en caso de que ocurra algún problema en la consulta
      console.error('Error al buscar aspiranteId:', error);
      throw new Error('Error al buscar el ID del aspirante'); // Lanzar una excepción genérica
    }
  }
}
