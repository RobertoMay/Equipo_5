import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { GenericService } from '../shared/generic.service';
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

    if (!startDate || !endDate) {
      throw new HttpException('Start date and end date are required', HttpStatus.BAD_REQUEST);
    }

    // Crear el documento y calcular el estado
    const convocatoria = {
      ...data,
      id: this.firestore.collection(ConvocatoriaDocument.collectionName).doc().id,
      status: false, // Estado inicial, se calculará después
    } as ConvocatoriaDocument;

    // Calcular el estado antes de guardar
    this.calculateStatus(convocatoria);

    // Guardar el documento en Firestore, incluyendo el estado calculado
    await this.firestore.collection(ConvocatoriaDocument.collectionName).doc(convocatoria.id).set(convocatoria);
    return convocatoria;
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

  // Obtener el documento actual y combinar los cambios
  const updatedData = { ...currentDoc.data(), ...data } as ConvocatoriaDocument;

  // Calcular el estado actualizado
  this.calculateStatus(updatedData);

  // Guardar el documento actualizado en Firestore, incluyendo el estado calculado
  await docRef.set(updatedData);
  return updatedData;
}


  // Función para asegurar que la fecha de cierre no sea menor que la de inicio
  private ensureValidDates(startDate: Date, endDate: Date): void {
    //console.log("Ejecutando ensureValidDates con fechas:", startDate, endDate);  // Línea de depuración
    if (!startDate || !endDate) {
      throw new HttpException('Start date and end date are required', HttpStatus.BAD_REQUEST);
    }

    if (startDate > endDate) {
     // console.error("Error: Fecha de cierre es menor que la fecha de inicio");  // Línea de depuración
      throw new HttpException('End date cannot be earlier than start date', HttpStatus.BAD_REQUEST);
    }
  }

  private calculateStatus(convocatoria: ConvocatoriaDocument): ConvocatoriaDocument {
    const now = new Date();
  
    // Asegurarse de que las fechas estén en la zona horaria local
    const startDate = new Date(convocatoria.startDate);
    const endDate = new Date(convocatoria.endDate);
  
    // Ajustar las fechas para que estén en la zona horaria local
    const startDayLocal = new Date(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate()).getTime();
    const endDayLocal = new Date(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate(), 23, 59, 59, 999).getTime();
    const currentDateLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  
    // Depuración detallada para verificar cada valor
    //console.log("Fecha actual (solo día):", new Date(currentDateLocal).toLocaleDateString());
    //console.log("Fecha de inicio ajustada (solo día):", new Date(startDayLocal).toLocaleDateString());
    //console.log("Fecha de fin ajustada (solo día):", new Date(endDayLocal).toLocaleDateString());
  
    // Comparación de rango de fechas sin horas
    convocatoria.status = currentDateLocal >= startDayLocal && currentDateLocal <= endDayLocal;
  
    //console.log("Estado calculado:", convocatoria.status); // Depuración del resultado final
    return convocatoria;
  }
  
}
