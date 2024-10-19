import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { GenericService } from '../shared/generic.service'; // Ajusta el path según tu estructura
import { StudentDocDocument } from '../todos/document/studentdoc.document';
import { Storage } from '@google-cloud/storage';
import { Firestore, FieldValue } from '@google-cloud/firestore'; // Asegúrate de importar FieldValue

@Injectable()
export class StudenDocService extends GenericService<StudentDocDocument> {
  public firestore: Firestore; // Cambia a public o protected
  private storage: Storage;

  constructor() {
    super(StudentDocDocument.collectionName); // Usando la colección definida en el documento
    this.firestore = new Firestore();
    this.storage = new Storage();
  }

  // Método para añadir un documento a un aspirante
  async addDocumentToAspirante(
    aspiranteId: string,
    documentBuffer: Buffer,
    documentType: string,
    documentName: string,
  ): Promise<void> {
    try {
      // Validar parámetros de entrada
      if (!aspiranteId || !documentBuffer || !documentType || !documentName) {
        throw new BadRequestException(
          'Faltan datos requeridos para el documento',
        );
      }

      // Verificar si el aspirante existe
      const aspiranteDocs = await this.firestore
        .collection('StudentDocDocument')
        .where('aspiranteId', '==', aspiranteId)
        .get();

      if (aspiranteDocs.empty) {
        throw new NotFoundException(
          `No se encontró el aspirante con ID: ${aspiranteId}`,
        );
      }

      // Acceder al primer documento encontrado por aspiranteId
      const aspiranteDoc = aspiranteDocs.docs[0];
      console.log('Aspirante Doc:', aspiranteDoc.data());

      // Subir el PDF a Firebase Storage
      const link = await this.uploadPdfToFirebase(
        documentBuffer,
        aspiranteId,
        documentName,
      );

      // Crear el objeto de documento
      const document = {
        name: documentName,
        type: documentType,
        link: link,
        date: new Date().toISOString(),
        status: 'pending',
      };

      // Actualizar el documento del aspirante en Firestore
      const aspiranteRef = this.firestore
        .collection('StudentDocDocument')
        .doc(aspiranteDoc.id);
      await aspiranteRef.update({
        Documents: FieldValue.arrayUnion(document),
      });
    } catch (error) {
      console.error('Error al añadir documento al aspirante:', error);

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Error interno al intentar añadir el documento. Por favor, inténtelo de nuevo más tarde.',
        );
      }
    }
  }

  // Método para subir un PDF a Firebase Storage
  private async uploadPdfToFirebase(
    pdfBuffer: Buffer,
    aspiranteId: string,
    documentName: string,
  ): Promise<string> {
    const bucketName = 'albergue-57e14.appspot.com';
    const fileName = `${aspiranteId}_${documentName}.pdf`;

    try {
      const bucket = this.storage.bucket(bucketName);
      const file = bucket.file(fileName);

      // Subir el PDF al bucket
      await file.save(pdfBuffer, {
        metadata: { contentType: 'application/pdf' },
        resumable: false,
      });

      // Generar la URL pública
      await file.makePublic();

      // Devuelve la URL del archivo subido
      return `https://storage.googleapis.com/${bucketName}/${fileName}`;
    } catch (error) {
      console.error('Error al subir el PDF a Firebase Storage:', error);
      throw new Error('No se pudo subir el PDF a Firebase Storage');
    }
  }

  async getDocumentsByAspiranteId(aspiranteId: string): Promise<any[]> {
    try {
      // Buscar documentos en la colección 'StudentDocDocument' que coincidan con aspiranteId
      const snapshot = await this.firestore
        .collection('StudentDocDocument')
        .where('aspiranteId', '==', aspiranteId)
        .get();

      if (snapshot.empty) {
        throw new NotFoundException(
          `No se encontraron documentos para el aspirante con ID: ${aspiranteId}`,
        );
      }

      // Acceder al primer documento encontrado y extraer los documentos
      const aspiranteData = snapshot.docs[0].data();
      const documents = aspiranteData.Documents || [];

      return documents;
    } catch (error) {
      console.error('Error al obtener documentos por aspiranteId:', error);
      throw new Error('No se pudieron recuperar los documentos.');
    }
  }

  // Método para obtener estudiantes con paginación y filtrado
  async getStudents(skip: number, limit: number, name?: string): Promise<any[]> {
    try {
      let query = this.firestore.collection('StudentDocDocument').limit(limit).offset(skip);

      // Si se proporciona un nombre, agregar el filtro
      if (name) {
        query = query.where('name', '>=', name).where('name', '<=', name + '\uf8ff');
      }

      const snapshot = await query.get();

      if (snapshot.empty) {
        throw new NotFoundException('No se encontraron estudiantes');
      }

      // Mapear los documentos encontrados
      const students = snapshot.docs.map((doc) => {
        const studentData = doc.data() as StudentDocDocument;

        return {
          id: doc.id,
          name: studentData.name,
          lastName1: studentData.lastName1,
          lastName2: studentData.lastName2,
          email: studentData.email,
          curp: studentData.curp,
          enrollmentStatus: studentData.enrollmentStatus,
          documents: studentData.Documents || [],
        };
      });

      return students;
    } catch (error) {
      throw new Error('Error al obtener los estudiantes');
    }
  }

   // Método para obtener los estudiantes inscritos con paginación, filtro por nombre y orden descendente
   async getEnrolledStudents(page: number, name?: string): Promise<StudentDocDocument[]> {
    const studentsPerPage = 20;
    let query = this.firestore
      .collection('StudentDocDocument')
      .where('enrollmentStatus', '==', true)
      .orderBy('id', 'desc')  // Ordenar de manera descendente
      .offset((page - 1) * studentsPerPage)
      .limit(studentsPerPage);
      
    // Si se proporciona un nombre, agregamos el filtro
    if (name) {
      query = query
        .where('name', '>=', name)
        .where('name', '<=', name + '\uf8ff');
    }

    const snapshot = await query.get();

    if (snapshot.empty) {
      throw new NotFoundException('No se encontraron estudiantes inscritos.');
    }

    const students: StudentDocDocument[] = [];
    snapshot.forEach((doc) => {
      students.push(doc.data() as StudentDocDocument);
    });

    return students;
  }

  // Método para obtener los estudiantes no inscritos con paginación, filtro por nombre y orden descendente
  async getNotEnrolledStudents(page: number, name?: string): Promise<StudentDocDocument[]> {
    const studentsPerPage = 20;
    let query = this.firestore
      .collection('StudentDocDocument')
      .where('enrollmentStatus', '==', false)
      .orderBy('id', 'desc')  // Ordenar de manera descendente
      .offset((page - 1) * studentsPerPage)
      .limit(studentsPerPage);

    // Si se proporciona un nombre, agregamos el filtro
    if (name) {
      query = query
        .where('name', '>=', name)
        .where('name', '<=', name + '\uf8ff');
    }

    const snapshot = await query.get();

    if (snapshot.empty) {
      throw new NotFoundException('No se encontraron estudiantes no inscritos.');
    }

    const students: StudentDocDocument[] = [];
    snapshot.forEach((doc) => {
      students.push(doc.data() as StudentDocDocument);
    });

    return students;
  }


  // Método para actualizar el estado de un documento específico de un aspirante
  async updateDocumentStatus(
    aspiranteId: string,
    documentLink: string,
    newStatus: 'accepted' | 'rejected' | 'pending',
  ): Promise<void> {
    try {
      // Validar parámetros de entrada
      if (!aspiranteId || !documentLink || !newStatus) {
        throw new BadRequestException('Datos requeridos faltantes.');
      }

      // Verificar si el aspirante existe
      const snapshot = await this.firestore
        .collection('StudentDocDocument')
        .where('aspiranteId', '==', aspiranteId)
        .get();

      if (snapshot.empty) {
        throw new NotFoundException(
          `No se encontraron documentos para el aspirante con ID: ${aspiranteId}`,
        );
      }

      // Acceder al primer documento encontrado por aspiranteId
      const aspiranteDoc = snapshot.docs[0];
      const aspiranteData = aspiranteDoc.data();
      const documents = aspiranteData.Documents || [];

      // Buscar el documento por el link
      const documentIndex = documents.findIndex(
        (doc: any) => doc.link === documentLink,
      );

      if (documentIndex === -1) {
        throw new NotFoundException(
          `No se encontró el documento con el link proporcionado para el aspirante con ID: ${aspiranteId}`,
        );
      }

      // Actualizar el estado del documento
      documents[documentIndex].status = newStatus;

      // Actualizar el documento en Firestore
      const aspiranteRef = this.firestore
        .collection('StudentDocDocument')
        .doc(aspiranteDoc.id);
      await aspiranteRef.update({ Documents: documents });
    } catch (error) {
      console.error('Error al actualizar el estado del documento:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Error interno al intentar actualizar el estado del documento. Por favor, inténtelo de nuevo más tarde.',
        );
      }
    }
  }
  async updateEnrollmentStatus(
    aspiranteId: string,
    enrollmentStatus: boolean,
  ): Promise<void> {
    try {
      // Validar parámetros de entrada
      if (aspiranteId === undefined || enrollmentStatus === undefined) {
        throw new BadRequestException(
          'Faltan datos requeridos para actualizar el estado de inscripción',
        );
      }

      // Verificar si el aspirante existe
      const aspiranteDocs = await this.firestore
        .collection('StudentDocDocument')
        .where('aspiranteId', '==', aspiranteId)
        .get();

      if (aspiranteDocs.empty) {
        throw new NotFoundException(
          `No se encontró el aspirante con ID: ${aspiranteId}`,
        );
      }

      // Acceder al primer documento encontrado
      const aspiranteDoc = aspiranteDocs.docs[0];
      const aspiranteRef = this.firestore
        .collection('StudentDocDocument')
        .doc(aspiranteDoc.id);

      // Actualizar el estado de inscripción en el documento del aspirante
      await aspiranteRef.update({ enrollmentStatus: enrollmentStatus });

      console.log(
        `Estado de inscripción actualizado para aspiranteId: ${aspiranteId}`,
      );
    } catch (error) {
      console.error('Error al actualizar el estado de inscripción:', error);

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Error interno al intentar actualizar el estado de inscripción. Por favor, inténtelo de nuevo más tarde.',
        );
      }
    }
  }
}
