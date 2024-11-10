import { Injectable, HttpException, HttpStatus, OnModuleInit, Logger } from '@nestjs/common';
import { GenericService } from '../shared/generic.service';
import { ConvocatoriaDocument } from '../todos/document/convocatoria.document';
import { Firestore } from '@google-cloud/firestore';

@Injectable()
export class ConvocatoriaService extends GenericService<ConvocatoriaDocument> implements OnModuleInit {
  private readonly logger = new Logger(ConvocatoriaService.name);
  constructor() {
    super(ConvocatoriaDocument.collectionName);
    this.firestore = new Firestore();
  }
  onModuleInit() {
    setInterval(() => {
      this.updateExpiredStatus();
    }, 24 * 60 * 60 * 1000); // Cada 24 horas
  }
  // Obtener convocatoria por ID
  async getById(id: string): Promise<ConvocatoriaDocument> {
    const docRef = this.firestore.collection(ConvocatoriaDocument.collectionName).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new HttpException('Convocatoria not found', HttpStatus.NOT_FOUND);
    }
    return doc.data() as ConvocatoriaDocument;
  }

  // Obtener la convocatoria actual (la primera convocatoria activa encontrada)
  async getCurrentConvocatoria(): Promise<ConvocatoriaDocument> {
    const snapshot = await this.firestore
      .collection(ConvocatoriaDocument.collectionName)
      .where('status', '==', true)
      .limit(1)
      .get();

    if (snapshot.empty) {
      throw new HttpException('No active convocatoria found', HttpStatus.NOT_FOUND);
    }

    let convocatoria = snapshot.docs[0].data() as ConvocatoriaDocument;
    convocatoria = await this.updateAvailableCupoField(convocatoria); // Actualiza el cupo disponible
    return convocatoria;
  }

  // Crear una convocatoria
  async saveConvocatoria(data: Partial<ConvocatoriaDocument>): Promise<ConvocatoriaDocument> {
    const { startDate, endDate, cupo } = data;
  
    // Validar que se reciban las fechas y el cupo
    if (!startDate || !endDate || cupo === undefined) {
      throw new HttpException('Start date, end date, and cupo are required', HttpStatus.BAD_REQUEST);
    }
  
    // Verificar si ya existe una convocatoria activa
    const activeConvocatoriaSnapshot = await this.firestore
      .collection(ConvocatoriaDocument.collectionName)
      .where('status', '==', true)
      .limit(1)
      .get();
  
    if (!activeConvocatoriaSnapshot.empty) {
      throw new HttpException(
        {
          message: 'No se puede crear una nueva convocatoria mientras haya una convocatoria activa.'
        },
        HttpStatus.CONFLICT
      );
    }
  
    // Crear el documento con los valores iniciales y el campo availableCupo
    const convocatoria = {
      ...data,
      id: this.firestore.collection(ConvocatoriaDocument.collectionName).doc().id,
      status: false, // Estado inicial
      availableCupo: cupo, // Inicializar el cupo disponible al valor de cupo
    } as ConvocatoriaDocument;
  
    // Calcular el estado antes de guardar
    this.calculateStatus(convocatoria);
  
    // Guardar el documento en Firestore, incluyendo el campo availableCupo
    await this.firestore.collection(ConvocatoriaDocument.collectionName).doc(convocatoria.id).set(convocatoria);
  
    return convocatoria;
  }
  
  
  // Obtener todas las convocatorias
  async getAllConvocatorias(): Promise<ConvocatoriaDocument[]> {
    const snapshot = await this.firestore.collection(ConvocatoriaDocument.collectionName).get();

    if (snapshot.empty) {
      throw new HttpException('No convocatorias found', HttpStatus.NOT_FOUND);
    }

    const convocatorias: ConvocatoriaDocument[] = [];
    for (const doc of snapshot.docs) {
      let convocatoria = doc.data() as ConvocatoriaDocument;
      convocatoria = await this.updateAvailableCupoField(convocatoria);
      convocatorias.push(this.calculateStatus(convocatoria));
    }

    return convocatorias;
  }

  // Actualizar el cupo disponible en el campo de la convocatoria
  private async updateAvailableCupoField(convocatoria: ConvocatoriaDocument): Promise<ConvocatoriaDocument> {
    const aspirantesSnapshot = await this.firestore
      .collection('Aspirantes')
      .where('convocatoriaId', '==', convocatoria.id)
      .where('statusinscripcion', '==', true)
      .get();

    const aspirantesInscritos = aspirantesSnapshot.size;
    convocatoria.availableCupo = convocatoria.cupo - aspirantesInscritos;

    // Actualizar en Firestore
    await this.firestore.collection(ConvocatoriaDocument.collectionName).doc(convocatoria.id).update({
      availableCupo: convocatoria.availableCupo,
    });

    return convocatoria;
  }

  
   async updateConvocatoria(id: string, data: Partial<ConvocatoriaDocument>): Promise<ConvocatoriaDocument> {
  const docRef = this.firestore.collection(ConvocatoriaDocument.collectionName).doc(id);
  const currentDoc = await docRef.get();

  if (!currentDoc.exists) {
    throw new HttpException('Convocatoria not found', HttpStatus.NOT_FOUND);
  }

  // Obtener los datos actuales y combinar los cambios
  const updatedData = { ...currentDoc.data(), ...data } as ConvocatoriaDocument;
  
  // Calcular el estado actualizado
  this.calculateStatus(updatedData);

  // Si se actualiza el cupo, recalcula el availableCupo
  if (data.cupo !== undefined) {
    updatedData.availableCupo = updatedData.cupo - await this.getAspirantesInscritos(id);
  }

  // Guardar el documento actualizado en Firestore
  await docRef.set(updatedData);
  return updatedData;
}

// Método auxiliar para contar aspirantes inscritos en una convocatoria específica
private async getAspirantesInscritos(convocatoriaId: string): Promise<number> {
  const aspirantesSnapshot = await this.firestore
    .collection('Aspirantes')
    .where('convocatoriaId', '==', convocatoriaId)
    .where('statusinscripcion', '==', true)
    .get();
    
  return aspirantesSnapshot.size;
}

// Actualizar cupo disponible, ocupado y total (siempre que haya inscripciones)
async updateCuposOnInscription(convocatoriaId: string, newCupo: number, newAvailableCupo: number, newOccupiedCupo: number): Promise<void> {
  const docRef = this.firestore.collection(ConvocatoriaDocument.collectionName).doc(convocatoriaId);
  await docRef.update({
    cupo: newCupo,
    availableCupo: newAvailableCupo,
    occupiedCupo: newOccupiedCupo
  });
}
// Actualizar cupos al eliminar un aspirante
async updateCuposOnDeletion(convocatoriaId: string, newCupo: number, newAvailableCupo: number, newOccupiedCupo: number): Promise<void> {
  const docRef = this.firestore.collection(ConvocatoriaDocument.collectionName).doc(convocatoriaId);
  await docRef.update({
    cupo: newCupo,
    availableCupo: newAvailableCupo,
    occupiedCupo: newOccupiedCupo
  });
}

  // Método para verificar y actualizar el estado de las convocatorias expiradas
  async updateExpiredStatus(): Promise<void> {
    const now = new Date();

    const snapshot = await this.firestore
      .collection(ConvocatoriaDocument.collectionName)
      .where('status', '==', true) // Solo convocatorias activas
      .get();

    for (const doc of snapshot.docs) {
      const convocatoria = doc.data() as ConvocatoriaDocument;
      const endDate = new Date(convocatoria.endDate);

      if (endDate < now) {
        // Cambiar status a false si la fecha de cierre ha pasado
        await this.firestore
          .collection(ConvocatoriaDocument.collectionName)
          .doc(convocatoria.id)
          .update({ status: false });

        this.logger.log(`Convocatoria con ID ${convocatoria.id} marcada como cerrada`);
      }
    }
  }

  // Calcular estado de convocatoria basado en fechas y zona horaria local
  private calculateStatus(convocatoria: ConvocatoriaDocument): ConvocatoriaDocument {
    const now = new Date();
    const startDate = new Date(convocatoria.startDate);
    const endDate = new Date(convocatoria.endDate);

    const startDayLocal = new Date(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate()).getTime();
    const endDayLocal = new Date(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate(), 23, 59, 59, 999).getTime();
    const currentDateLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    convocatoria.status = currentDateLocal >= startDayLocal && currentDateLocal <= endDayLocal;
    return convocatoria;
  }
}
