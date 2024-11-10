import {
  Injectable,
  Logger,
  OnModuleInit,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import { Storage } from '@google-cloud/storage';
import { ConvocatoriaDocument } from '../todos/document/convocatoria.document';
import { StudentDocDocument } from '../todos/document/studentdoc.document';


@Injectable()
export class ExpiredStudentService implements OnModuleInit {
  private readonly logger = new Logger(ExpiredStudentService.name);
  private firestore: Firestore;
  private storage: Storage;
  private readonly intervalTime = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
  private nextRunTime: Date;

  constructor() {
    this.firestore = new Firestore();
    this.storage = new Storage();
  }

  onModuleInit() {
    this.scheduleTask();
  }

  private scheduleTask() {
    console.log('iniciando');
    this.nextRunTime = new Date(Date.now() + this.intervalTime);
    console.log('iniciando 2');
    setInterval(() => {
      console.log('iniciando 3');
      this.removeExpiredUnenrolledStudents();
      this.nextRunTime = new Date(Date.now() + this.intervalTime);
    }, this.intervalTime);
  }

  private async removeExpiredUnenrolledStudents(): Promise<void> {
    console.log('eliminando studens');
    const now = new Date();
const thresholdDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Convierte thresholdDate a una cadena en formato "YYYY-MM-DD"
  const thresholdDateStr = thresholdDate.toISOString().split('T')[0];
  console.log('Fecha límite para eliminación (thresholdDate):', thresholdDateStr)
    
    const snapshot = await this.firestore
      .collection(ConvocatoriaDocument.collectionName)
      .where('status', '==', false)
      .where('endDate', '==', thresholdDateStr)
      .get();
      console.log('antes del for');
    for (const doc of snapshot.docs) {
      const convocatoria = doc.data() as ConvocatoriaDocument;
      console.log('dentro',convocatoria.id);
      this.logger.log(
        `Procesando convocatoria cerrada con ID ${convocatoria.id}`,
      );

      const studentsSnapshot = await this.firestore
        .collection(StudentDocDocument.collectionName)
        .where('convocatoriaId', '==', convocatoria.id)
        .where('enrollmentStatus', '==', false)
        .get();

      for (const studentDoc of studentsSnapshot.docs) {
        const student = studentDoc.data() as StudentDocDocument;
        await this.deleteStudentData(student);
        this.logger.log(
          `Estudiante con ID ${student.aspiranteId} eliminado de la convocatoria ${convocatoria.id}`,
        );
      }
    }
  }

  private async deleteStudentData(student: StudentDocDocument): Promise<void> {
    // Elimina los documentos del estudiante en Firebase Storage
    for (const document of student.Documents) {
      await this.deleteDocumentForAspirante(student.aspiranteId, document.type);
    }

    // Elimina el documento del estudiante en Firestore
    await this.firestore
      .collection(StudentDocDocument.collectionName)
      .doc(student.id)
      .delete();

    // Elimina el documento en la colección StudentData
    await this.firestore
      .collection('DataStudent')
      .doc(student.aspiranteId)
      .delete()
      .catch((error) => {
        this.logger.error(
          `Error eliminando StudentData para aspiranteId ${student.aspiranteId}: ${error.message}`,
        );
      });
  }

// Servicio para eliminar un documento específico de un aspirante en Firebase Storage
private async deleteDocumentForAspirante(
  aspiranteId: string,
  documentType: string,
): Promise<void> {
  try {
    if (!aspiranteId.trim() || !documentType.trim()) {
      throw new BadRequestException(
        'Faltan datos requeridos para eliminar el documento',
      );
    }

    const aspiranteDocs = await this.firestore
      .collection('StudentDocDocument')
      .where('aspiranteId', '==', aspiranteId)
      .get();

    if (aspiranteDocs.empty) {
      throw new NotFoundException(
        `No se encontró el aspirante con ID: ${aspiranteId}`,
      );
    }

    const aspiranteDoc = aspiranteDocs.docs[0];
    const aspiranteData = aspiranteDoc.data();
    const documents = aspiranteData.Documents || [];

    const documentIndex = documents.findIndex(
      (doc) => doc.type === documentType,
    );
    if (documentIndex === -1) {
      throw new NotFoundException(
        `No se encontró un documento del tipo: ${documentType} para el aspirante con ID: ${aspiranteId}`,
      );
    }

    const documentToDelete = documents[documentIndex];

    // Verifica si el tipo del documento es "Solicitud Ingreso"
    if (documentToDelete.type === "Solicitud Ingreso") {
      this.logger.log(
        `Documento del tipo ${documentType} para el aspirante con ID: ${aspiranteId} no se eliminará por ser de tipo "Solicitud Ingreso".`
      );
      return; // Salir de la función sin eliminar el documento
    }

    const documentLink = documentToDelete.link;

    if (documentLink) {
      await this.deletePdfFromFirebase(documentLink);
      documents.splice(documentIndex, 1);

      const aspiranteRef = this.firestore
        .collection('StudentDocDocument')
        .doc(aspiranteDoc.id);
      await aspiranteRef.update({ Documents: documents });
      this.logger.log(
        `Documento del tipo ${documentType} eliminado correctamente para el aspirante con ID: ${aspiranteId}.`,
      );
    } else {
      throw new NotFoundException(
        'No se encontró el enlace del documento para eliminar.',
      );
    }
  } catch (error) {
    this.logger.error(
      `Error al eliminar el documento del aspirante ${aspiranteId}: ${error.message}`,
    );
    throw new InternalServerErrorException(
      'Error interno al intentar eliminar el documento.',
    );
  }
}


  private async deletePdfFromFirebase(pdfUrl: string): Promise<void> {
    const bucketName = 'albergue-57e14.appspot.com';

    try {
      const fileName = pdfUrl.split(
        `https://storage.googleapis.com/${bucketName}/`,
      )[1];

      if (!fileName) {
        throw new Error(
          'No se pudo extraer el nombre del archivo de la URL proporcionada',
        );
      }

      const bucket = this.storage.bucket(bucketName);
      const file = bucket.file(fileName);

      await file.delete();
      this.logger.log(
        `Archivo ${fileName} eliminado correctamente de Firebase Storage.`,
      );
    } catch (error) {
      this.logger.error('Error al eliminar el PDF de Firebase Storage:', error);
      throw new Error('No se pudo eliminar el PDF de Firebase Storage');
    }
  }

  getDaysUntilNextRun(): number {
    const now = new Date();
    const timeUntilNextRun = this.nextRunTime.getTime() - now.getTime();
    return Math.ceil(timeUntilNextRun / (24 * 60 * 60 * 1000));
  }

  async getDaysUntilDelete(): Promise<any[]> {
    const now = new Date();
    const snapshot = await this.firestore
      .collection(ConvocatoriaDocument.collectionName)
      .where('status', '==', false)  // Convocatorias cerradas
      .get();
  
    const result = [];
  
    for (const doc of snapshot.docs) {
      const convocatoria = doc.data() as ConvocatoriaDocument;
      let endDate: Date;
  
      // Convertir endDate de cadena a Date
      if (typeof convocatoria.endDate === 'string') {
        endDate = new Date(convocatoria.endDate);
        
        // Verificar si la conversión fue exitosa
        if (isNaN(endDate.getTime())) {
          this.logger.error(`La fecha endDate de la convocatoria con ID ${convocatoria.id} no es válida.`);
          continue; // Saltar este documento si la fecha no es válida
        }
      } else {
        this.logger.error(`El formato de endDate en la convocatoria ${convocatoria.id} no es una cadena.`);
        continue; // Saltar este documento si endDate no es una cadena
      }
  
      // Calcular los días restantes hasta el borrado
      const daysUntilDelete = Math.ceil(
        (endDate.getTime() + 30 * 24 * 60 * 60 * 1000 - now.getTime()) / (24 * 60 * 60 * 1000)
      );
  
      if (daysUntilDelete > 0) {
        result.push({
          convocatoriaId: convocatoria.id,
          daysUntilDelete,
        });
      }
    }
  
    return result;
  }
}
