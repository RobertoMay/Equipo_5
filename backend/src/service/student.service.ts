import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import { StudentDocument } from '../todos/document/student.document';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';

@Injectable()
export class StudentService {
  private firestore: Firestore;

  constructor() {
    this.firestore = new Firestore();
  }

  // Obtener los datos del estudiante
  async getStudentById(id: string): Promise<StudentDocument> {
    const doc = await this.firestore.collection(StudentDocument.collectionName).doc(id).get();
    if (!doc.exists) {
      throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
    }
    return doc.data() as StudentDocument;
  }

  // Actualizar el estado del estudiante (por ejemplo, los documentos o inscripción)
  async updateStudent(id: string, data: Partial<StudentDocument>): Promise<void> {
    const docRef = this.firestore.collection(StudentDocument.collectionName).doc(id);
    await docRef.update(data);
  }

  // Crear o actualizar un estudiante relacionado con un aspirante
  async saveStudent(data: Partial<StudentDocument>): Promise<StudentDocument> {
    if (!data.aspiranteId) {
      throw new HttpException('Aspirante ID is required', HttpStatus.BAD_REQUEST);
    }

    const student = {
      ...data,
      id: this.firestore.collection(StudentDocument.collectionName).doc().id,
    } as StudentDocument;

    await this.firestore.collection(StudentDocument.collectionName).doc(student.id).set(student);
    return student;
  }

  // Obtener un estudiante por el ID del aspirante
  async getStudentByAspiranteId(aspiranteId: string): Promise<StudentDocument> {
    const snapshot = await this.firestore.collection(StudentDocument.collectionName)
      .where('aspiranteId', '==', aspiranteId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      throw new HttpException('Student not found for given Aspirante ID', HttpStatus.NOT_FOUND);
    }

    return snapshot.docs[0].data() as StudentDocument;
  }
  // Generar el PDF siguiendo el formato específico
  async generatePdf(student: StudentDocument): Promise<string> {
    const doc = new PDFDocument();
    const filePath = `./pdfs/${student.id}_solicitud_ingreso.pdf`;

    doc.pipe(fs.createWriteStream(filePath));

    // Título
    doc
      .fontSize(16)
      .text('SOLICITUD DE INGRESO A LA CASA O COMEDOR', { align: 'center' })
      .moveDown();

    // Fecha de solicitud del trámite
    doc.fontSize(12).text(`Fecha de solicitud: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    // Datos Generales del Solicitante
    doc
      .fontSize(14)
      .text('Datos Generales del Solicitante', { underline: true })
      .moveDown();

    doc.fontSize(12).text(`Nombre: ${student.firstName} ${student.middleName} ${student.lastName}`);
    doc.text(`CURP: ${student.curp}`);
    doc.text(`Correo electrónico: ${student.email}`);
    doc.moveDown();

    // Datos Generales del Tutor
    doc
      .fontSize(14)
      .text('Datos Generales del Tutor', { underline: true })
      .moveDown();

    // Ejemplo de tutor (puedes reemplazarlo con la información real si la tienes)
    doc.fontSize(12).text('Nombre del Tutor: Juan Pérez');
    doc.text('CURP: TUTOR_CURP');
    doc.moveDown();

    // Datos Académicos
    doc
      .fontSize(14)
      .text('Datos Académicos', { underline: true })
      .moveDown();

    doc.fontSize(12).text('Tipo de Escuela: Pública');
    doc.text('CCT: 12345XYZ');
    doc.moveDown();

    // Antecedentes de Salud
    doc
      .fontSize(14)
      .text('Antecedentes de Salud', { underline: true })
      .moveDown();

    doc.fontSize(12).text('Alergias: Ninguna');
    doc.text('Problemas Respiratorios: No');
    doc.text('Tratamiento Médico Prolongado: No');
    doc.moveDown();

    // Información del Trámite
    doc
      .fontSize(14)
      .text('Información del Trámite', { underline: true })
      .moveDown();

    doc.fontSize(12).text('Solicito 3 comidas al día hasta la conclusión del ciclo escolar.');

    // Firma del Solicitante y del Tutor
    doc.moveDown().text('Firma del Solicitante: _____________________________');
    doc.moveDown().text('Firma del Tutor: _____________________________');

    // Termina el documento
    doc.end();

    // Retorna el path donde se guarda el PDF
    return filePath;
  }
  
}
