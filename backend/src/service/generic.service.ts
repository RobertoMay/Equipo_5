import { Firestore } from '@google-cloud/firestore';
import { IGenericService } from '../interfaces/generic-service.interface'; // Ajusta el path según tu estructura de carpetas

export class GenericService<T> implements IGenericService<T> {
  protected firestore: Firestore;
  protected collectionName: string;

  constructor(collectionName: string) {
    this.firestore = new Firestore();
    this.collectionName = collectionName;
  }

  async findAll(): Promise<T[]> {
    const snapshot = await this.firestore.collection(this.collectionName).get();
    const items: T[] = [];
    snapshot.forEach(doc => items.push(doc.data() as T));
    return items;
  }

  async findById(id: string): Promise<T> {
    const doc = await this.firestore.collection(this.collectionName).doc(id).get();
    if (!doc.exists) {
      throw new Error('Documento no encontrado');
    }
    return doc.data() as T;
  }

  async create(data: T): Promise<T> {
    const docRef = this.firestore.collection(this.collectionName).doc();
    const newItem = { ...data, id: docRef.id };
    await docRef.set(newItem);
    return newItem;
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    const docRef = this.firestore.collection(this.collectionName).doc(id);
    await docRef.update(data);
  }

  async delete(id: string): Promise<void> {
    const docRef = this.firestore.collection(this.collectionName).doc(id);
    await docRef.delete();
  }
}
