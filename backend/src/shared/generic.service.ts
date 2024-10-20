import { Firestore } from '@google-cloud/firestore';
import { IGenericService } from '../interfaces/generic-service.interface'; // Ajusta el path según tu estructura de carpetas

export class GenericService<T> implements IGenericService<T> {
  protected firestore: Firestore;
  public collectionName: string;

  constructor(collectionName: string) {
    this.firestore = new Firestore();
    this.collectionName = collectionName;
  }

  async findAll(): Promise<T[]> {
    try {
      const snapshot = await this.firestore.collection(this.collectionName).get();
      const items: T[] = [];
      snapshot.forEach(doc => items.push(doc.data() as T));
      console.log('Todos los documentos obtenidos correctamente');
      return items;
    } catch (error) {
      console.error('Error al obtener los documentos:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<T> {
    try {
      const doc = await this.firestore.collection(this.collectionName).doc(id).get();
      if (!doc.exists) {
        throw new Error('Documento no encontrado');
      }
      console.log(`Documento con ID ${id} obtenido correctamente`);
      return doc.data() as T;
    } catch (error) {
      console.error(`Error al obtener el documento con ID ${id}:`, error);
      throw error;
    }
  }

  async create(data: T): Promise<T> {
    try {
      const docRef = this.firestore.collection(this.collectionName).doc();
      const newItem = { ...data, id: docRef.id };
      await docRef.set(newItem);
      console.log(`Documento creado con ID ${docRef.id}`);
      return newItem;
    } catch (error) {
      console.error('Error al crear el documento:', error);
      throw error;
    }
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = this.firestore.collection(this.collectionName).doc(id);
      await docRef.update(data);
      console.log(`Documento con ID ${id} actualizado correctamente`);
    } catch (error) {
      console.error(`Error al actualizar el documento con ID ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = this.firestore.collection(this.collectionName).doc(id);
      await docRef.delete();
      console.log(`Documento con ID ${id} eliminado correctamente`);
    } catch (error) {
      console.error(`Error al eliminar el documento con ID ${id}:`, error);
      throw error;
    }
  }
}
