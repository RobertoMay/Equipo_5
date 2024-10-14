import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import { StudentDocument } from '../todos/document/student.document';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as puppeteer from 'puppeteer';
import { join } from 'path';
import * as path from 'path';
@Injectable()
export class StudentService {
  private firestore: Firestore;

  constructor() {
    this.firestore = new Firestore();
  }

  // Obtener los datos del estudiante
  async getStudentById(id: string): Promise<StudentDocument> {
    const doc = await this.firestore
      .collection(StudentDocument.collectionName)
      .doc(id)
      .get();
    if (!doc.exists) {
      throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
    }
    return doc.data() as StudentDocument;
  }

  // Actualizar el estado del estudiante (por ejemplo, los documentos o inscripción)
  async updateStudent(
    id: string,
    data: Partial<StudentDocument>,
  ): Promise<void> {
    const docRef = this.firestore
      .collection(StudentDocument.collectionName)
      .doc(id);
    await docRef.update(data);
  }

  // Crear o actualizar un estudiante relacionado con un aspirante
  async saveStudent(data: Partial<StudentDocument>): Promise<StudentDocument> {
    if (!data.aspiranteId) {
      throw new HttpException(
        'Aspirante ID is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const student = {
      ...data,
      id: this.firestore.collection(StudentDocument.collectionName).doc().id,
    } as StudentDocument;

    await this.firestore
      .collection(StudentDocument.collectionName)
      .doc(student.id)
      .set(student);
    return student;
  }

  // Obtener un estudiante por el ID del aspirante
  async getStudentByAspiranteId(aspiranteId: string): Promise<StudentDocument> {
    const snapshot = await this.firestore
      .collection(StudentDocument.collectionName)
      .where('aspiranteId', '==', aspiranteId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      throw new HttpException(
        'Student not found for given Aspirante ID',
        HttpStatus.NOT_FOUND,
      );
    }

    return snapshot.docs[0].data() as StudentDocument;
  }
  // Generar el PDF siguiendo el formato específico
  //

  // Generar el PDF utilizando una plantilla HTML
  async generatePdf(data: any): Promise<string> {
    if (!data.curp) {
      throw new Error('CURP is required to generate PDF');
    }

    // Ruta de la plantilla HTML
    const templatePath = path.join(__dirname, '../../pdfs/formato.html');

    // Cargar el contenido de la plantilla HTML
    const htmlTemplate = fs.readFileSync(templatePath, 'utf8');

    // Reemplazar marcadores de posición en la plantilla
    let populatedHtml = htmlTemplate
      //Datos solicitante
      .replace(/{{nombre}}/g, data.nombre || 'Nombre completo')
      .replace(/{{curp}}/g, data.curp || 'CURP')
      .replace(/{{primerApellido}}/g, data.primerApellido)
      .replace(/{{segundoApellido}}/g, data.segundoApellido)
      .replace(/{{telefonoFijo}}/g, data.telefonoFijo)
      .replace(/{{telefonoMovil}}/g, data.telefonoMovil)
      .replace(/{{correoElectronico}}/g, data.correoElectronico)
      .replace(/{{fechaNacimiento}}/g, data.fechaNacimiento || 'DD/MM/AAAA')
      .replace(/{{lenguaIndigena}}/g, data.lenguaIndigena)
      //Direccion
      .replace(/{{estado}}/g, data.direccion.estado || '---')
      .replace(/{{municipio}}/g, data.direccion.municipio || '---')
      .replace(/{{localidad}}/g, data.direccion.localidad || '---')
      .replace(/{{comunidad}}/g, data.direccion.comunidad || '---')
      //Datos Madre
      .replace(/{{curpMadre}}/g, data.informacionMadre.curpMadre || '---')
      .replace(/{{nombreMadre}}/g, data.informacionMadre.nombreMadre || '---')
      .replace(
        /{{primerApellidoMadre}}/g,
        data.informacionMadre.primerApellidoMadre || '---',
      )
      .replace(
        /{{segundoApellidoMadre}}/g,
        data.informacionMadre.segundoApellidoMadre || '---',
      )
      .replace(
        /{{fechaNacimientoMadre}}/g,
        data.informacionMadre.fechaNacimientoMadre || '---',
      )
      .replace(
        /{{edoNacimientoMadre}}/g,
        data.informacionMadre.edoNacimientoMadre || '---',
      )
      //Datos Padre
      .replace(/{{curpPadre}}/g, data.informacionPadre.curpPadre || '---')
      .replace(/{{nombrePadre}}/g, data.informacionPadre.nombrePadre || '---')
      .replace(
        /{{primerApellidoPadre}}/g,
        data.informacionPadre.primerApellidoPadre || '---',
      )
      .replace(
        /{{segundoApellidoPadre}}/g,
        data.informacionPadre.segundoApellidoPadre || '---',
      )
      .replace(
        /{{fechaNacimientoPadre}}/g,
        data.informacionPadre.fechaNacimientoPadre || '---',
      )
      .replace(
        /{{edoNacimientoPadre}}/g,
        data.informacionPadre.edoNacimientoPadre || '---',
      )
      //Datos tutor
      .replace(/{{nombreTutor}}/g, data.informacionTutor.nombreTutor || '---')
      .replace(/{{curpTutor}}/g, data.informacionTutor.curpTutor || '---')
      .replace(
        /{{parentescoTutor}}/g,
        data.informacionTutor.parentescoTutor || '---',
      )
      .replace(
        /{{primerApellidoTutor}}/g,
        data.informacionTutor.primerApellidoTutor || '---',
      )
      .replace(
        /{{segundoApellidoTutor}}/g,
        data.informacionTutor.segundoApellidoTutor || '---',
      )
      .replace(
        /{{fechaNacimientoTutor}}/g,
        data.informacionTutor.fechaNacimientoTutor || '---',
      )
      .replace(
        /{{edoNacimientoTutor}}/g,
        data.informacionTutor.edoNacimientoTutor || '---',
      )
      //Datos Casa Comedor
      .replace(/{{comunidadCasa}}/g, data.datosCasaComedor.comunidadCasa)
      .replace(/{{localidadCasa}}/g, data.datosCasaComedor.localidadCasa)
      .replace(
        /{{centroCoordinador}}/g,
        data.datosCasaComedor.centroCoordinador,
      )
      .replace(/{{nombreCasa}}/g, data.datosCasaComedor.nombreCasa || '---')

      //Translado de la casa-comunidad de origen
      .replace(
        /{{especifAcceso}}/g,
        data.trasladoCasaComunidad.especifAcceso || ' ',
      )
      .replace(
        /{{especifRiesgo}}/g,
        data.trasladoCasaComunidad.especifRiesgo || ' ',
      )

      //Discapacidades
      .replace(
        /{{especifDiscapacidad}}/g,
        data.discapacidades.especifDiscapacidad || ' ',
      )
      //Datos Academicos
      .replace(/{{cct}}/g, data.datosAcademicos.cct || ' ')
      .replace(/{{nombreEscuela}}/g, data.datosAcademicos.nombreEscuela || ' ')
      .replace(/{{escolaridad}}/g, data.datosAcademicos.escolaridad || '---')
      .replace(
        /{{semestreoanosCursados}}/g,
        data.datosAcademicos.semestreoanosCursados || '---',
      )
      .replace(/{{tipoCurso}}/g, data.datosAcademicos.tipoCurso || '---')
      //Salud
      .replace(/{{alergiaDetalles}}/g, data.salud.alergiaDetalles || ' ')
      .replace(/{{respirarDetalles}}/g, data.salud.respirarDetalles || ' ')
      .replace(
        /{{tratamientoDetalles}}/g,
        data.salud.tratamientoDetalles || ' ',
      );

    // Reemplazo dinámico para los checkboxes de puebloIndigena
    if (data.puebloIndigena === 'Pueblo1') {
      populatedHtml = populatedHtml.replace(
        /<input type="checkbox" id="indigena-checkbox">/g,
        '<input type="checkbox" id="indigena-checkbox" checked>',
      );
    } else if (data.puebloIndigena === 'Pueblo2') {
      populatedHtml = populatedHtml.replace(
        /<input type="checkbox" id="afromexicano-checkbox">/g,
        '<input type="checkbox" id="afromexicano-checkbox" checked>',
      );
    }

    // Reemplazo dinámico para los checkboxes de sexo
    switch (data.sexo) {
      case 'Mujer':
        populatedHtml = populatedHtml.replace(
          /<input type="checkbox" id="mujer-checkbox">/g,
          '<input type="checkbox" id="mujer-checkbox" checked>',
        );
        break;
      case 'Hombre':
        populatedHtml = populatedHtml.replace(
          /<input type="checkbox" id="hombre-checkbox">/g,
          '<input type="checkbox" id="hombre-checkbox" checked>',
        );
        break;
      case 'Otro':
        populatedHtml = populatedHtml.replace(
          /<input type="checkbox" id="otro-checkbox">/g,
          '<input type="checkbox" id="otro-checkbox" checked>',
        );
        break;
      default:
        // Si no coincide con ninguno, no se marcarán los checkboxes
        break;
    }
    // Reemplazo dinámico para los checkboxes de estadoMadre
    switch (data.informacionMadre.estadoMadre) {
      case 'finado':
        populatedHtml = populatedHtml.replace(
          /<input type="checkbox" id="finadom-checkbox">/g,
          '<input type="checkbox" id="finadom-checkbox" checked>',
        );
        break;
      case 'ausente':
        populatedHtml = populatedHtml.replace(
          /<input type="checkbox" id="ausentem-checkbox">/g,
          '<input type="checkbox" id="ausentem-checkbox" checked>',
        );
        break;
      case 'presente':
        populatedHtml = populatedHtml.replace(
          /<input type="checkbox" id="presentem-checkbox">/g,
          '<input type="checkbox" id="presentem-checkbox" checked>',
        );
        break;
      default:
        // Si no coincide con ninguno, no se marcarán los checkboxes
        break;
    }
    // Reemplazo dinámico para los checkboxes de estadoPadre
    switch (data.informacionPadre.estadoPadre) {
      case 'finado':
        populatedHtml = populatedHtml.replace(
          /<input type="checkbox" id="finadop-checkbox">/g,
          '<input type="checkbox" id="finadop-checkbox" checked>',
        );
        break;
      case 'ausente':
        populatedHtml = populatedHtml.replace(
          /<input type="checkbox" id="ausentep-checkbox">/g,
          '<input type="checkbox" id="ausentep-checkbox" checked>',
        );
        break;
      case 'presente':
        populatedHtml = populatedHtml.replace(
          /<input type="checkbox" id="presentep-checkbox">/g,
          '<input type="checkbox" id="presentep-checkbox" checked>',
        );
        break;
      default:
        // Si no coincide con ninguno, no se marcarán los checkboxes
        break;
    }
    // Reemplazo dinámico para los checkboxes de tipoCasa
    switch (data.datosCasaComedor.tipoCasa) {
      case 'Casa':
        populatedHtml = populatedHtml.replace(
          /<input type="checkbox" id="casa-checkbox">/g,
          '<input type="checkbox" id="casa-checkbox" checked>',
        );
        break;
      case 'Comedor':
        populatedHtml = populatedHtml.replace(
          /<input type="checkbox" id="comedor-checkbox">/g,
          '<input type="checkbox" id="comedor-checkbox" checked>',
        );
        break;
      case 'Escolar de la niñez':
        populatedHtml = populatedHtml.replace(
          /<input type="checkbox" id="niñez-checkbox">/g,
          '<input type="checkbox" id="niñez-checkbox" checked>',
        );
        break;
      case 'Comunitario del estudiante':
        populatedHtml = populatedHtml.replace(
          /<input type="checkbox" id="comunit-checkbox">/g,
          '<input type="checkbox" id="comunit-checkbox" checked>',
        );
        break;
      case 'Universitario':
        populatedHtml = populatedHtml.replace(
          /<input type="checkbox" id="universitario-checkbox">/g,
          '<input type="checkbox" id="universitario-checkbox" checked>',
        );
        break;
      default:
        // Si no coincide con ninguno, no se marcarán los checkboxes
        break;
    }
    // Reemplazo dinámico para los checkboxes de  medioAcceso
    switch (data.trasladoCasaComunidad.medioAcceso) {
      case 'A pie':
        populatedHtml = populatedHtml.replace(
          /<input type="checkbox" id="pie-checkbox">/g,
          '<input type="checkbox" id="pie-checkbox" checked>',
        );
        break;
      case 'En bicicleta':
        populatedHtml = populatedHtml.replace(
          /<input type="checkbox" id="bici-checkbox">/g,
          '<input type="checkbox" id="bici-checkbox" checked>',
        );
        break;
      case 'En vehículo':
        populatedHtml = populatedHtml.replace(
          /<input type="checkbox" id="vehi-checkbox">/g,
          '<input type="checkbox" id="vehi-checkbox" checked>',
        );
        break;
      case 'Otro':
        populatedHtml = populatedHtml.replace(
          /<input type="checkbox" id="otrov-checkbox">/g,
          '<input type="checkbox" id="otrov-checkbox" checked>',
        );
        break;
      default:
        // Si no coincide con ninguno, no se marcarán los checkboxes
        break;
    }
    // Reemplazo dinámico para los checkboxes de  riesgoAcceso
    switch (data.trasladoCasaComunidad.riesgoAcceso) {
      case 'Deslaves':
        populatedHtml = populatedHtml.replace(
          /<input type="checkbox" id="des-checkbox">/g,
          '<input type="checkbox" id="des-checkbox" checked>',
        );
        break;
      case 'Barrancas':
        populatedHtml = populatedHtml.replace(
          /<input type="checkbox" id="barrancas-checkbox">/g,
          '<input type="checkbox" id="barrancas-checkbox" checked>',
        );
        break;
      case 'Rio crecido':
        populatedHtml = populatedHtml.replace(
          /<input type="checkbox" id="rio-checkbox">/g,
          '<input type="checkbox" id="rio-checkbox" checked>',
        );
        break;
      case 'Inundación':
        populatedHtml = populatedHtml.replace(
          /<input type="checkbox" id="inundacion-checkbox">/g,
          '<input type="checkbox" id="inundacion-checkbox" checked>',
        );
        break;
      case 'Otro':
        populatedHtml = populatedHtml.replace(
          /<input type="checkbox" id="otror-checkbox">/g,
          '<input type="checkbox" id="otror-checkbox" checked>',
        );
        break;
      default:
        // Si no coincide con ninguno, no se marcarán los checkboxes
        break;
    }
    // Reemplazo dinámico para los checkboxes de   tipoDiscapacidad
    switch (data.discapacidades.tipoDiscapacidad) {
      case 'Motriz':
        populatedHtml = populatedHtml.replace(
          /<input type="checkbox" id="mot-checkbox">/g,
          '<input type="checkbox" id="mot-checkbox" checked>',
        );
        break;
      case 'Auditivo':
        populatedHtml = populatedHtml.replace(
          /<input type="checkbox" id="aud-checkbox">/g,
          '<input type="checkbox" id="aud-checkbox" checked>',
        );
        break;
      case 'Visual':
        populatedHtml = populatedHtml.replace(
          /<input type="checkbox" id="vis-checkbox">/g,
          '<input type="checkbox" id="vis-checkbox" checked>',
        );
        break;
      case 'Mental':
        populatedHtml = populatedHtml.replace(
          /<input type="checkbox" id="men-checkbox">/g,
          '<input type="checkbox" id="men-checkbox" checked>',
        );
        break;
      case 'Otro':
        populatedHtml = populatedHtml.replace(
          /<input type="checkbox" id="otrod-checkbox">/g,
          '<input type="checkbox" id="otrod-checkbox" checked>',
        );
        break;
      default:
        // Si no coincide con ninguno, no se marcarán los checkboxes
        break;
    }
    // Reemplazo dinámico para los checkboxes de tipoEscuela
    if (data.datosAcademicos.tipoEscuela === 'Pública') {
      populatedHtml = populatedHtml.replace(
        /<input type="checkbox" id="publica-checkbox">/g,
        '<input type="checkbox" id="publica-checkbox" checked>',
      );
    } else if (data.datosAcademicos.tipoEscuela === 'Comunitaria') {
      populatedHtml = populatedHtml.replace(
        /<input type="checkbox" id="comunitaria-checkbox">/g,
        '<input type="checkbox" id="comunitaria-checkbox" checked>',
      );
    }

    // Reemplazo dinámico para los checkboxes de alergia
    if (data.salud.alergia === 'Sí') {
      populatedHtml = populatedHtml.replace(
        /<input type="checkbox" id="alsi-checkbox">/g,
        '<input type="checkbox" id="alsi-checkbox" checked>',
      );
    } else if (data.salud.alergia === 'No') {
      populatedHtml = populatedHtml.replace(
        /<input type="checkbox" id="alno-checkbox">/g,
        '<input type="checkbox" id="alno-checkbox" checked>',
      );
    }

    // Reemplazo dinámico para los checkboxes de respirar
    if (data.salud.respirar === 'Sí') {
      populatedHtml = populatedHtml.replace(
        /<input type="checkbox" id="resi-checkbox">/g,
        '<input type="checkbox" id="resi-checkbox" checked>',
      );
    } else if (data.salud.respirar === 'No') {
      populatedHtml = populatedHtml.replace(
        /<input type="checkbox" id="reno-checkbox">/g,
        '<input type="checkbox" id="reno-checkbox" checked>',
      );
    }

    // Reemplazo dinámico para los checkboxes de tratamiento
    if (data.salud.tratamiento === 'Sí') {
      populatedHtml = populatedHtml.replace(
        /<input type="checkbox" id="tmsi-checkbox">/g,
        '<input type="checkbox" id="tmsi-checkbox" checked>',
      );
    } else if (data.salud.tratamiento === 'No') {
      populatedHtml = populatedHtml.replace(
        /<input type="checkbox" id="tmno-checkbox">/g,
        '<input type="checkbox" id="tmno-checkbox" checked>',
      );
    }
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(populatedHtml, { waitUntil: 'domcontentloaded' });

    const filePath = `./pdfs/${data.curp}_solicitud_ingreso.pdf`;
    await page.pdf({
      path: filePath,
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    return filePath;
  }
}
