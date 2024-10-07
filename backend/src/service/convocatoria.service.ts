import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { GenericService } from './generic.service';
import { ConvocatoriaDocument } from '../todos/document/convocatoria.document';

@Injectable()
export class ConvocatoriaService extends GenericService<ConvocatoriaDocument> {
  constructor() {
    super(ConvocatoriaDocument.collectionName);
  }

  // Obtener la convocatoria actual (primer documento encontrado)
  async getCurrentConvocatoria(): Promise<ConvocatoriaDocument> {
    const snapshot = await this.firestore.collection(ConvocatoriaDocument.collectionName).limit(1).get();

    if (snapshot.empty) {
      throw new HttpException('No active convocatoria found', HttpStatus.NOT_FOUND);
    }

    const convocatoria = snapshot.docs[0].data() as ConvocatoriaDocument;
    return this.calculateStatus(convocatoria);
  }

  // Crear una convocatoria
  async saveConvocatoria(data: Partial<ConvocatoriaDocument>): Promise<ConvocatoriaDocument> {
    const { startDate, endDate } = data;

    // Validar que las fechas sean correctas
    this.ensureValidDates(startDate as Date, endDate as Date);

    const convocatoria = {
      ...data,
      id: this.firestore.collection(ConvocatoriaDocument.collectionName).doc().id,
      status: false,
    } as ConvocatoriaDocument;

    await this.firestore.collection(ConvocatoriaDocument.collectionName).doc(convocatoria.id).set(convocatoria);
    return this.calculateStatus(convocatoria);
  }
  async getAllConvocatorias(): Promise<ConvocatoriaDocument[]> {
    const snapshot = await this.firestore.collection(ConvocatoriaDocument.collectionName).get();

    if (snapshot.empty) {
        throw new HttpException('No convocatorias found', HttpStatus.NOT_FOUND);
    }

    // Aplicar calculateStatus a cada convocatoria
    const convocatorias: ConvocatoriaDocument[] = [];
    snapshot.forEach(doc => {
        let convocatoria = doc.data() as ConvocatoriaDocument;
        convocatoria = this.calculateStatus(convocatoria); // Calcular el estado actual
        convocatorias.push(convocatoria);
    });

    return convocatorias;
}
  async updateConvocatoria(id: string, data: Partial<ConvocatoriaDocument>): Promise<ConvocatoriaDocument> {
    const docRef = this.firestore.collection(ConvocatoriaDocument.collectionName).doc(id);
    const currentDoc = await docRef.get();

    if (!currentDoc.exists) {
      throw new HttpException('Convocatoria not found', HttpStatus.NOT_FOUND);
    }

    await docRef.update(data);

    const updatedConvocatoria = (await docRef.get()).data() as ConvocatoriaDocument;
    return this.calculateStatus(updatedConvocatoria); // Calcula el estado internamente antes de devolver
}


  // Función para asegurar que la fecha de cierre no sea menor que la de inicio
  private ensureValidDates(startDate: Date, endDate: Date): void {
    //console.log("Ejecutando ensureValidDates con fechas:", startDate, endDate);  // Línea de depuración
    if (!startDate || !endDate) {
      throw new HttpException('Start date and end date are required', HttpStatus.BAD_REQUEST);
    }

    if (startDate > endDate) {
    //  console.error("Error: Fecha de cierre es menor que la fecha de inicio");  // Línea de depuración
      throw new HttpException('End date cannot be earlier than start date', HttpStatus.BAD_REQUEST);
    }
  }
  private calculateStatus(convocatoria: ConvocatoriaDocument): ConvocatoriaDocument {
    const now = new Date(); // Fecha actual
    const startDate = new Date(convocatoria.startDate); // Fecha de inicio de la convocatoria
    const endDate = new Date(convocatoria.endDate); // Fecha de finalización de la convocatoria
  
    // Convertimos todas las fechas a sólo el día en UTC para comparación
    const currentDateUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const startDayUTC = Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate());
    const endDayUTC = Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate(), 23, 59, 59, 999);
  
    // Depuración detallada de cada paso
   // console.log("Fecha actual en UTC (sólo día):", new Date(currentDateUTC).toISOString());
   // console.log("Fecha de inicio en UTC:", new Date(startDayUTC).toISOString());
   // console.log("Fecha de fin en UTC (fin del día):", new Date(endDayUTC).toISOString());
  
    // Lógica de estado de apertura de la convocatoria
    convocatoria.status = currentDateUTC >= startDayUTC && currentDateUTC <= endDayUTC;
  
   // console.log("Estado calculado:", convocatoria.status); // Depuración del resultado final
    return convocatoria;
  }
  
}
