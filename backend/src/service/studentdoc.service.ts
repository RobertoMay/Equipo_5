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
import * as admin from 'firebase-admin';
@Injectable()
export class StudenDocService extends GenericService<StudentDocDocument> {
  public firestore: Firestore; // Cambia a public o protected
  private storage: Storage;

  constructor() {
    super(StudentDocDocument.collectionName); // Usando la colección definida en el documento
    this.firestore = new Firestore();
    this.storage = new Storage();
  }

  //Este método añadirá un comentario dentro del array comments en el documento StudentDocDocument.
  async addCommentToAspirante(
    aspiranteId: string,
    commentText: string,
    createdBy: string,
  ): Promise<void> {
    try {
      // Verificar si el aspirante existe
      const snapshot = await this.firestore
        .collection('StudentDocDocument')
        .where('aspiranteId', '==', aspiranteId)
        .get();

      if (snapshot.empty) {
        throw new NotFoundException(
          `No se encontró el aspirante con ID: ${aspiranteId}`,
        );
      }

      // Acceder al primer documento encontrado por aspiranteId
      const aspiranteDoc = snapshot.docs[0];
      const aspiranteData = aspiranteDoc.data();
      const comments = aspiranteData.comments || [];

      // Verificar que el texto del comentario no sea undefined
      if (!commentText || commentText.trim() === '') {
        throw new BadRequestException(
          'El texto del comentario no puede estar vacío.',
        );
      }

      // Crear un nuevo comentario con valores definidos
      const newComment = {
        id: this.firestore.collection('comments').doc().id, // Generar un ID único para el comentario
        comment: commentText,
        createdAt: new Date().toISOString(), // Convertir a string para evitar problemas con Firestore
        createdBy: createdBy || 'Admin', // Si el campo creado por está vacío, usar "Anónimo"
      };

      // Añadir el comentario a la lista de comentarios
      comments.push(newComment);

      // Actualizar el documento del aspirante en Firestore con el nuevo comentario
      const aspiranteRef = this.firestore
        .collection('StudentDocDocument')
        .doc(aspiranteDoc.id);
      await aspiranteRef.update({ comments: comments });

      console.log(
        `Comentario agregado correctamente para aspiranteId: ${aspiranteId}`,
      );
    } catch (error) {
      console.error('Error al agregar comentario:', error);
      throw new InternalServerErrorException(
        'Error al intentar agregar el comentario. Por favor, inténtelo de nuevo más tarde.',
      );
    }
  }

  //Método para obtener los comentarios de un estudiante:
  async getCommentsByStudent(aspiranteId: string): Promise<any[]> {
    try {
      const studentDocSnapshot = await this.firestore
        .collection('StudentDocDocument')
        .where('aspiranteId', '==', aspiranteId)
        .get();

      if (studentDocSnapshot.empty) {
        throw new NotFoundException(
          `No se encontraron comentarios para el estudiante con ID: ${aspiranteId}`,
        );
      }

      const studentData = studentDocSnapshot.docs[0].data();
      return studentData.comments || [];
    } catch (error) {
      console.error('Error al obtener los comentarios:', error);
      throw new InternalServerErrorException(
        'Error al obtener los comentarios. Intenta de nuevo más tarde.',
      );
    }
  }
  //Método para eliminar un comentario
  async deleteCommentFromStudent(
    commentId: string,
    aspiranteId: string,
  ): Promise<void> {
    try {
      console.log(commentId);
      console.log(aspiranteId);
      const studentDocSnapshot = await this.firestore
        .collection('StudentDocDocument')
        .where('aspiranteId', '==', aspiranteId)
        .get();

      if (studentDocSnapshot.empty) {
        throw new NotFoundException(
          `No se encontró el estudiante con ID: ${aspiranteId}`,
        );
      }

      const studentDoc = studentDocSnapshot.docs[0];
      const studentData = studentDoc.data();
      const comments = studentData.comments || [];

      // Buscar el índice del comentario que se desea eliminar
      const commentIndex = comments.findIndex(
        (comment) => comment.id === commentId,
      );
      if (commentIndex === -1) {
        throw new NotFoundException(
          `No se encontró el comentario con ID: ${commentId}`,
        );
      }

      // Eliminar el comentario del array
      comments.splice(commentIndex, 1);

      // Actualizar el documento del estudiante
      await studentDoc.ref.update({ comments });

      console.log(`Comentario con ID: ${commentId} eliminado correctamente.`);
    } catch (error) {
      console.error('Error al eliminar el comentario:', error);
      throw new InternalServerErrorException(
        'Error al eliminar el comentario. Intenta de nuevo más tarde.',
      );
    }
  }

  // Método para añadir un documento a un aspirante
  async addDocumentToAspirante(
    aspiranteId: string,
    documentBuffer: Buffer,
    documentType: string,
    documentName: string,
  ): Promise<void> {
    try {
      if (!aspiranteId || !documentBuffer || !documentType || !documentName) {
        throw new BadRequestException(
          'Faltan datos requeridos para el documento',
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
  
      // Verificar si la fecha de inicio de inscripción ya está registrada
      if (!aspiranteData.enrollmentStartDate) {
        aspiranteData.enrollmentStartDate = new Date(); // Establece la fecha y hora actuales
        await aspiranteDoc.ref.update({ enrollmentStartDate: aspiranteData.enrollmentStartDate });
      }
  
      const link = await this.uploadPdfToFirebase(
        documentBuffer,
        aspiranteId,
        documentName,
      );
  
      const document = {
        name: documentName,
        type: documentType,
        link: link,
        date: new Date().toISOString(),
        status: 'uploaded',
      };
  
      await aspiranteDoc.ref.update({
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
  
  // Método para editar un documento de un aspirante
  async editDocumentForAspirante(
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
      const aspiranteData = aspiranteDoc.data();
      const documents = aspiranteData.Documents || [];

      // Verificar si ya existe un documento del mismo tipo
      const existingDocumentIndex = documents.findIndex(
        (doc) => doc.type === documentType,
      );
      if (existingDocumentIndex !== -1) {
        // Obtener el enlace del documento existente para eliminarlo
        const existingDocument = documents[existingDocumentIndex];
        await this.deletePdfFromFirebase(existingDocument.link); // Lógica para eliminar el PDF de Firebase Storage

        // Reemplazar el documento existente con el nuevo
        documents[existingDocumentIndex] = {
          name: documentName,
          type: documentType,
          link: '', // Dejar el link vacío temporalmente, se actualizará después
          date: new Date().toISOString(),
          status: 'uploaded',
        };
      } else {
        // Si no existe, agregar el nuevo documento
        documents.push({
          name: documentName,
          type: documentType,
          link: '', // Dejar el link vacío temporalmente, se actualizará después
          date: new Date().toISOString(),
          status: 'uploaded',
        });
      }

      // Subir el nuevo PDF a Firebase Storage
      const link = await this.uploadPdfToFirebase(
        documentBuffer,
        aspiranteId,
        documentName,
      );

      // Actualizar el enlace del nuevo documento en la colección de documentos
      documents[
        existingDocumentIndex !== -1
          ? existingDocumentIndex
          : documents.length - 1
      ].link = link;

      // Actualizar la colección de documentos del aspirante
      const aspiranteRef = this.firestore
        .collection('StudentDocDocument')
        .doc(aspiranteDoc.id);
      await aspiranteRef.update({
        Documents: documents,
      });
    } catch (error) {
      console.error('Error al editar el documento del aspirante:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Error interno al intentar editar el documento. Por favor, inténtelo de nuevo más tarde.',
        );
      }
    }
  }

  // Servicio para eliminar un documento específico de un aspirante en Firebase Storage
  async deleteDocumentForAspirante(
    aspiranteId: string,
    documentType: string,
  ): Promise<void> {
    try {
      // Validar parámetros de entrada
      if (!aspiranteId.trim() || !documentType.trim()) {
        throw new BadRequestException(
          'Faltan datos requeridos para eliminar el documento',
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
      const aspiranteData = aspiranteDoc.data();
      const documents = aspiranteData.Documents || [];

      // Buscar el documento del tipo especificado
      const documentIndex = documents.findIndex(
        (doc) => doc.type === documentType,
      );
      if (documentIndex === -1) {
        throw new NotFoundException(
          `No se encontró un documento del tipo: ${documentType} para el aspirante con ID: ${aspiranteId}`,
        );
      }

      // Obtener el enlace del documento existente para eliminarlo
      const documentToDelete = documents[documentIndex];
      const documentLink = documentToDelete.link;

      if (documentLink) {
        // Lógica para eliminar el PDF de Firebase Storage
        await this.deletePdfFromFirebase(documentLink);

        // Eliminar el documento del arreglo
        documents.splice(documentIndex, 1);

        // Actualizar la colección de documentos del aspirante
        const aspiranteRef = this.firestore
          .collection('StudentDocDocument')
          .doc(aspiranteDoc.id);
        await aspiranteRef.update({
          Documents: documents,
        });

        console.log(
          `Documento del tipo ${documentType} eliminado correctamente para el aspirante con ID: ${aspiranteId}.`,
        );
      } else {
        throw new NotFoundException(
          'No se encontró el enlace del documento para eliminar.',
        );
      }
    } catch (error) {
      console.error('Error al eliminar el documento del aspirante:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Error interno al intentar eliminar el documento. Por favor, inténtelo de nuevo más tarde.',
        );
      }
    }
  }

  // Método para eliminar un PDF de Firebase Storage utilizando la URL del documento
  private async deletePdfFromFirebase(pdfUrl: string): Promise<void> {
    const bucketName = 'albergue-57e14.appspot.com';

    try {
      // Extraer el nombre del archivo de la URL
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

      // Eliminar el archivo del bucket
      await file.delete();

      console.log(
        `Archivo ${fileName} eliminado correctamente de Firebase Storage.`,
      );
    } catch (error) {
      console.error('Error al eliminar el PDF de Firebase Storage:', error);
      throw new Error('No se pudo eliminar el PDF de Firebase Storage');
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
  // Método para obtener los Documentos de un Aspirante
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
      const Documents = aspiranteData.Documents || [];

      return Documents;
    } catch (error) {
      console.error('Error al obtener documentos por aspiranteId:', error);
      throw new Error('No se pudieron recuperar los documentos.');
    }
  }

  async getStudentByAspiranteId(aspiranteId: string): Promise<any[]> {
    try {
      // Buscar documentos en la colección 'StudentDocDocument' que coincidan con aspiranteId
      const snapshot = await this.firestore
        .collection('StudentDocDocument')
        .where('aspiranteId', '==', aspiranteId)
        .get();

      if (snapshot.empty) {
        throw new NotFoundException(
          `No se encontro el aspirante con ID: ${aspiranteId}`,
        );
      }

      // Acceder a todos los documentos encontrados y extraer los datos
      const aspiranteData = snapshot.docs.map((doc) => doc.data());

      return aspiranteData;
    } catch (error) {
      console.error('Error al estudiante por aspiranteId:', error);
      throw new Error('No se pudieron recuperar los documentos.');
    }
  }
  // Método para obtener estudiantes con paginación y filtrado
  async getStudents(
    skip: number,
    limit: number,
    name?: string,
  ): Promise<any[]> {
    try {
      let query = this.firestore
        .collection('StudentDocDocument')
        .limit(limit)
        .offset(skip);

      // Si se proporciona un nombre, agregar el filtro
      if (name) {
        query = query
          .where('name', '>=', name)
          .where('name', '<=', name + '\uf8ff');
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
  async getEnrolledStudents(
    page: number,
    name?: string,
  ): Promise<StudentDocDocument[]> {
    const studentsPerPage = 20;
    let query = this.firestore
      .collection('StudentDocDocument')
      .where('enrollmentStatus', '==', true)
      .orderBy('id', 'desc') // Ordenar de manera descendente
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
  async getNotEnrolledStudents(
    page: number,
    name?: string,
  ): Promise<StudentDocDocument[]> {
    const studentsPerPage = 20;
    let query = this.firestore
      .collection('StudentDocDocument')
      .where('enrollmentStatus', '==', false)
      .orderBy('id', 'desc') // Ordenar de manera descendente
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
      throw new NotFoundException(
        'No se encontraron estudiantes no inscritos.',
      );
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
    newStatus: 'approved' | 'rejected' | 'uploaded',
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

      // Verificar si todos los documentos están aprobados
      const allApproved = documents.every((doc) => doc.status === 'approved');

      if (allApproved) {
        // Si todos los documentos están aprobados, inscribir al aspirante
        await aspiranteRef.update({ enrollmentStatus: true });
        console.log(
          `Estado de inscripción actualizado automáticamente a inscrito para el aspiranteId: ${aspiranteId}`,
        );
      } else {
        // Si al menos uno está rechazado, desinscribir al aspirante
        await aspiranteRef.update({ enrollmentStatus: false });
        console.log(
          `Estado de inscripción actualizado automáticamente a no inscrito para el aspiranteId: ${aspiranteId}`,
        );
      }
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

  // Actualiza todos los documentos del aspirante
  async updateAllDocumentsStatus(
    aspiranteId: string,
    newStatus: 'approved' | 'rejected' | 'uploaded',
  ): Promise<void> {
    try {
      // Validar parámetros de entrada
      if (!aspiranteId || !newStatus) {
        throw new BadRequestException('Datos requeridos faltantes.');
      }

      // Verificar si el aspirante existe y obtener sus documentos
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

      // Actualizar el estado de todos los documentos
      documents.forEach((doc: any) => {
        doc.status = newStatus;
      });

      // Actualizar el documento en Firestore
      const aspiranteRef = this.firestore
        .collection('StudentDocDocument')
        .doc(aspiranteDoc.id);
      await aspiranteRef.update({ Documents: documents });

      // Verificar si el aspirante tiene exactamente 12 documentos
      const totalDocuments = documents.length;

      // Comprobar que todos los documentos estén aprobados y el total sea 12
      const allApproved = documents.every((doc) => doc.status === 'approved');

      if (allApproved && totalDocuments === 12) {
        // Si todos los documentos están aprobados y hay exactamente 12, inscribir al aspirante
        await aspiranteRef.update({ enrollmentStatus: true });
        console.log(
          `Estado de inscripción actualizado automáticamente a inscrito para el aspiranteId: ${aspiranteId}`,
        );
      } else {
        // Si no cumple con las condiciones, desinscribir al aspirante
        await aspiranteRef.update({ enrollmentStatus: false });
        console.log(
          `Estado de inscripción actualizado automáticamente a no inscrito para el aspiranteId: ${aspiranteId}`,
        );
      }
    } catch (error) {
      console.error(
        'Error al actualizar el estado de todos los documentos:',
        error,
      );
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Error interno al intentar actualizar el estado de los documentos. Por favor, inténtelo de nuevo más tarde.',
        );
      }
    }
  }
}
