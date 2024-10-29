import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import { AboutDocument } from '../todos/document/about.document';

@Injectable()
export class AboutService {
  private firestore = new Firestore();
  private collection = this.firestore.collection(AboutDocument.collectionName);


  constructor() {
    this.firestore = new Firestore();
  }

  /**
   * Crea un nuevo documento en la colección About con los datos de misión, visión y nombre del director(a).
   * Genera automáticamente un ID único para el documento.
   * @param data - Objeto que contiene la misión, visión y nombre del director(a).
   */
  async createAboutInfo(data: AboutDocument): Promise<{ message: string; document: AboutDocument }> {
    try {
      // Valida campos vacíos
      if (!data.mission || !data.vision || !data.directorName) {
        throw new BadRequestException('No se permiten campos vacíos');
      }

      // Inicializa la colección explícitamente si aún no está definida
      if (!this.collection) {
        this.collection = this.firestore.collection(AboutDocument.collectionName);
      }

      const docRef = this.collection.doc();
      const aboutData: AboutDocument = { ...data, id: docRef.id };
      await docRef.set(aboutData);

      return {
        message: 'Información creada exitosamente',
        document: aboutData, // Devuelve el documento completo
      };
    } catch (error) {
      console.error("Error al crear la información:", error);
      throw new BadRequestException('Error al crear la información');
    }
  }

  /**
   * Obtiene toda la información almacenada en la colección About.
   * @returns Un array de AboutDocument con todos los documentos en la colección.
   * @throws NotFoundException si la colección está vacía.
   */
  async getAboutInfo(): Promise<AboutDocument[]> {
    const snapshot = await this.firestore.collection(AboutDocument.collectionName).get();

    if (snapshot.empty) {
      throw new NotFoundException('No se encontró información en la colección About');
    }

    const aboutInfo: AboutDocument[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as AboutDocument,
    }));

    return aboutInfo;
  }

  /**
   * Obtiene la información de un documento específico en la colección About usando su ID.
   * @param id - ID del documento a recuperar.
   * @returns Un objeto AboutDocument con los datos del documento.
   * @throws NotFoundException si el documento no existe.
   */
  async getAboutInfoById(id: string): Promise<AboutDocument> {
    const docRef = this.firestore.collection(AboutDocument.collectionName).doc(id);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      throw new NotFoundException(`No se encontró la información con ID: ${id}`);
    }

    return { id: snapshot.id, ...snapshot.data() } as AboutDocument;
  }

  /**
   * Actualiza un documento específico en la colección About usando su ID.
   * Solo actualiza los campos proporcionados y no vacíos.
   * @param id - ID del documento a actualizar.
   * @param updateData - Objeto con los datos a actualizar (misión, visión y/o directorName).
   * @returns Un objeto AboutDocument con los datos actualizados.
   * @throws NotFoundException si el documento no existe.
   * @throws BadRequestException si no se proporcionan campos válidos para actualizar.
   */
  async updateAboutInfoById(
    id: string,
    data: Partial<AboutDocument>
  ): Promise<{ message: string; document: AboutDocument }> {
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new NotFoundException('Documento no encontrado');
      }

      // Actualizar solo los campos proporcionados que no están vacíos
      const updatedData: Partial<AboutDocument> = {
        ...doc.data(),
        ...data,
      };

      await docRef.update(updatedData);
      
      return {
        message: 'Información actualizada exitosamente',
        document: updatedData as AboutDocument, // Devuelve el documento actualizado
      };
    } catch (error) {
      console.error("Error al actualizar la información:", error);
      throw new BadRequestException('Error al actualizar la información');
    }
  }

  /**
   * Elimina un documento específico en la colección About usando su ID.
   * @param id - ID del documento a eliminar.
   * @throws NotFoundException si el documento no existe.
   */
  async deleteAboutInfoById(id: string): Promise<{ message: string }> {
    try {
      const docRef = this.firestore.collection(AboutDocument.collectionName).doc(id);
      const snapshot = await docRef.get();

      if (!snapshot.exists) {
        throw new NotFoundException(`No se encontró la información para eliminar con ID: ${id}`);
      }

      await docRef.delete();
      return { message: `Información con ID: ${id} eliminada exitosamente` };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error interno al intentar eliminar la información. Por favor, inténtelo de nuevo más tarde.',
      );
    }
  }
}
