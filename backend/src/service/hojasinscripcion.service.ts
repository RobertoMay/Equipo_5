import { Injectable } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore'; // Importa Firestore de Google Cloud
import { Storage } from '@google-cloud/storage'; // Importa Storage si lo necesitas

import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';

@Injectable()
export class HojasInscripcionService {
  constructor(
    private readonly firestore: Firestore, // Asegúrate de que esto coincida con lo que importaste
    private readonly storage: Storage, // Si estás utilizando Storage, asegúrate de que se inyecte correctamente
  ) {}

  async generateAndUploadPdf(idAspirante: string, data: any) {
    try {
      // Verifica si el aspirante existe
      const aspiranteDoc = await this.firestore
        .collection('Aspirantes')
        .doc(idAspirante)
        .get();
      if (!aspiranteDoc.exists) {
        throw new Error('Aspirante no encontrado');
      }

      // Verifica si ya existe un documento para este aspirante
      const existingDocs = await this.firestore
        .collection('HojasInscripcion')
        .where('id_Aspirante', '==', idAspirante)
        .get();
      if (!existingDocs.empty) {
        throw new Error('Ya existe un documento para este aspirante');
      }

      // Carga la plantilla HTML
      const templatePath = path.join(__dirname, '../../pdfs/formato.html');
      const htmlTemplate = fs.readFileSync(templatePath, 'utf8');

      // Usa el JSON recibido para poblar la plantilla
      console.log('Datos del aspirante:', data);
      const populatedHtml = this.populateTemplate(data, htmlTemplate);
      console.log('Datos del aspirante:', populatedHtml);
      // Genera el PDF
      const pdfOptions = {
        format: 'A4',
        printBackground: true,
        margin: {
          top: '10mm', // Ajusta los márgenes superiores
          bottom: '10mm', // Ajusta los márgenes inferiores para el pie de página
          left: '10mm', // Ajusta los márgenes izquierdos
          right: '10mm', // Ajusta los márgenes derechos
        },
      };

      const pdfBuffer = await this.generatePdfBuffer(populatedHtml, pdfOptions);

      // Guarda el PDF en el almacenamiento de Firebase usando la CURP como nombre
      const pdfUrl = await this.uploadPdfToFirebase(pdfBuffer, data.curp);

      // Guarda la información del documento generado en Firestore
      await this.savePdfInfoInFirestore(idAspirante, pdfUrl, data.curp);
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      throw new Error(`No se pudo generar el PDF: ${error.message}`);
    }
  }

  private populateTemplate(data: any, htmlTemplate: string): string {
    // Obtener la fecha actual
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0'); // Obtiene el día con 2 dígitos
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Obtiene el mes (0-11) y lo ajusta
    const year = now.getFullYear(); // Obtiene el año

    let populatedHtml = htmlTemplate
      // Datos solicitante
      .replace(/{{DD}}/g, day || 'DD')
      .replace(/{{MM}}/g, month || 'MMM')
      .replace(/{{AAAA}}/g, String(year) || 'AAAA')
      .replace(/{{nombre}}/g, data.nombre || 'Nombre completo')
      .replace(/{{curp}}/g, data.curp || 'CURP')
      .replace(/{{primerApellido}}/g, data.primerApellido)
      .replace(/{{segundoApellido}}/g, data.segundoApellido)
      .replace(/{{telefonoFijo}}/g, data.telefonoFijo)
      .replace(/{{telefonoMovil}}/g, data.telefonoMovil)
      .replace(/{{correoElectronico}}/g, data.correoElectronico)
      .replace(/{{fechaNacimiento}}/g, data.fechaNacimiento || 'DD/MM/AAAA')
      .replace(/{{lenguaIndigena}}/g, data.lenguaIndigena)
      // Direccion
      .replace(/{{estado}}/g, data.estado || '---')
      .replace(/{{municipio}}/g, data.municipio || '---')
      .replace(/{{localidad}}/g, data.localidad || '---')
      .replace(/{{comunidad}}/g, data.comunidad || '---')
      // Datos Madre
      .replace(/{{curpMadre}}/g, data.curpMadre || '---')
      .replace(/{{nombreMadre}}/g, data.nombreMadre || '---')
      .replace(/{{primerApellidoMadre}}/g, data.primerApellidoMadre || '---')
      .replace(/{{segundoApellidoMadre}}/g, data.segundoApellidoMadre || '---')
      .replace(/{{fechaNacimientoMadre}}/g, data.fechaNacimientoMadre || '---')
      .replace(/{{edoNacimientoMadre}}/g, data.edoNacimientoMadre || '---')
      // Datos Padre
      .replace(/{{curpPadre}}/g, data.curpPadre || '---')
      .replace(/{{nombrePadre}}/g, data.nombrePadre || '---')
      .replace(/{{primerApellidoPadre}}/g, data.primerApellidoPadre || '---')
      .replace(/{{segundoApellidoPadre}}/g, data.segundoApellidoPadre || '---')
      .replace(/{{fechaNacimientoPadre}}/g, data.fechaNacimientoPadre || '---')
      .replace(/{{edoNacimientoPadre}}/g, data.edoNacimientoPadre || '---')
      // Datos tutor
      .replace(/{{nombreTutor}}/g, data.nombreTutor || '---')
      .replace(/{{curpTutor}}/g, data.curpTutor || '---')
      .replace(/{{parentescoTutor}}/g, data.parentescoTutor || '---')
      .replace(/{{primerApellidoTutor}}/g, data.primerApellidoTutor || '---')
      .replace(/{{segundoApellidoTutor}}/g, data.segundoApellidoTutor || '---')
      .replace(/{{fechaNacimientoTutor}}/g, data.fechaNacimientoTutor || '---')
      .replace(/{{edoNacimientoTutor}}/g, data.edoNacimientoTutor || '---')
      // Datos Casa Comedor
      .replace(/{{comunidadCasa}}/g, data.comunidadCasa || '---')
      .replace(/{{localidadCasa}}/g, data.localidadCasa || '---')
      .replace(/{{centroCoordinador}}/g, data.centroCoordinador || '---')
      .replace(/{{nombreCasa}}/g, data.nombreCasa || '---')
      // Traslado de la casa-comunidad de origen
      .replace(/{{especifAcceso}}/g, data.especifAcceso || ' ')
      .replace(/{{especifRiesgo}}/g, data.especifRiesgo || ' ')
      // Discapacidades
      .replace(/{{especifDiscapacidad}}/g, data.especifDiscapacidad || ' ')
      // Datos Académicos
      .replace(/{{cct}}/g, data.cct || ' ')
      .replace(/{{nombreEscuela}}/g, data.nombreEscuela || ' ')
      .replace(/{{escolaridad}}/g, data.escolaridad || '---')
      .replace(
        /{{semestreoanosCursados}}/g,
        data.semestreoanosCursados || '---',
      )
      .replace(/{{tipoCurso}}/g, data.tipoCurso || '---')
      // Salud
      .replace(/{{alergiaDetalles}}/g, data.alergiaDetalles || ' ')
      .replace(/{{respirarDetalles}}/g, data.respirarDetalles || ' ')
      .replace(/{{tratamientoDetalles}}/g, data.tratamientoDetalles || ' ');

    // Reemplazo dinámico para los checkboxes de puebloIndigena
    const pueblosIndigenas = {
      Pueblo1: 'indigena-checkbox',
      Pueblo2: 'afromexicano-checkbox',
    };
    const puebloCheckboxId = pueblosIndigenas[data.puebloIndigena];
    if (puebloCheckboxId) {
      populatedHtml = populatedHtml.replace(
        new RegExp(`<input type="checkbox" id="${puebloCheckboxId}">`, 'g'),
        `<input type="checkbox" id="${puebloCheckboxId}" checked>`,
      );
    }

    // Reemplazo dinámico para los checkboxes de sexo
    const sexos = {
      Mujer: 'mujer-checkbox',
      Hombre: 'hombre-checkbox',
      Otro: 'otro-checkbox',
    };
    const sexoCheckboxId = sexos[data.sexo];
    if (sexoCheckboxId) {
      populatedHtml = populatedHtml.replace(
        new RegExp(`<input type="checkbox" id="${sexoCheckboxId}">`, 'g'),
        `<input type="checkbox" id="${sexoCheckboxId}" checked>`,
      );
    }

    // Función genérica para checkboxes de estado
    // Reemplazo dinámico para los checkboxes de estadoMadre
    console.log(data.estadoMadre);
    switch (data.estadoMadre) {
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
    switch (data.estadoPadre) {
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
    const tiposCasa = {
      Casa: 'casa-checkbox',
      Comedor: 'comedor-checkbox',
      'Escolar de la niñez': 'niñez-checkbox',
      'Comunitario del estudiante': 'comunit-checkbox',
      Universitario: 'universitario-checkbox',
    };
    const tipoCasaCheckboxId = tiposCasa[data.tipoCasa];
    if (tipoCasaCheckboxId) {
      populatedHtml = populatedHtml.replace(
        new RegExp(`<input type="checkbox" id="${tipoCasaCheckboxId}">`, 'g'),
        `<input type="checkbox" id="${tipoCasaCheckboxId}" checked>`,
      );
    }

    // Reemplazo dinámico para los checkboxes de medioAcceso
    const mediosAcceso = {
      'A pie': 'pie-checkbox',
      'En bicicleta': 'bici-checkbox',
      'En vehículo': 'vehi-checkbox',
      Otro: 'otrov-checkbox',
    };
    const medioAccesoCheckboxId = mediosAcceso[data.medioAcceso];
    if (medioAccesoCheckboxId) {
      populatedHtml = populatedHtml.replace(
        new RegExp(
          `<input type="checkbox" id="${medioAccesoCheckboxId}">`,
          'g',
        ),
        `<input type="checkbox" id="${medioAccesoCheckboxId}" checked>`,
      );
    }

    // Reemplazo dinámico para los checkboxes de  riesgoAcceso
    switch (data.riesgoAcceso) {
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
    switch (data.tipoDiscapacidad) {
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
    if (data.tipoEscuela === 'Pública') {
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
    if (data.alergia === 'Sí') {
      populatedHtml = populatedHtml.replace(
        /<input type="checkbox" id="alsi-checkbox">/g,
        '<input type="checkbox" id="alsi-checkbox" checked>',
      );
    } else if (data.alergia === 'No') {
      populatedHtml = populatedHtml.replace(
        /<input type="checkbox" id="alno-checkbox">/g,
        '<input type="checkbox" id="alno-checkbox" checked>',
      );
    }

    // Reemplazo dinámico para los checkboxes de respirar
    if (data.respirar === 'Sí') {
      populatedHtml = populatedHtml.replace(
        /<input type="checkbox" id="resi-checkbox">/g,
        '<input type="checkbox" id="resi-checkbox" checked>',
      );
    } else if (data.respirar === 'No') {
      populatedHtml = populatedHtml.replace(
        /<input type="checkbox" id="reno-checkbox">/g,
        '<input type="checkbox" id="reno-checkbox" checked>',
      );
    }

    // Reemplazo dinámico para los checkboxes de tratamiento
    if (data.tratamiento === 'Sí') {
      populatedHtml = populatedHtml.replace(
        /<input type="checkbox" id="tmsi-checkbox">/g,
        '<input type="checkbox" id="tmsi-checkbox" checked>',
      );
    } else if (data.tratamiento === 'No') {
      populatedHtml = populatedHtml.replace(
        /<input type="checkbox" id="tmno-checkbox">/g,
        '<input type="checkbox" id="tmno-checkbox" checked>',
      );
    }
    return populatedHtml;
  }
  private async generatePdfBuffer(html: string, options: any): Promise<Buffer> {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Set the HTML content
      await page.setContent(html, { waitUntil: 'load' });

      // Generate the PDF
      const pdfBuffer = await page.pdf(options);

      await browser.close();

      // Convert Uint8Array to Buffer
      return Buffer.from(pdfBuffer);
    } catch (error) {
      console.error('Error generating PDF with Puppeteer:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  private async uploadPdfToFirebase(
    pdfBuffer: Buffer,
    curp: string,
  ): Promise<string> {
    const bucketName = 'albergue-57e14.appspot.com'; // Cambia al nombre de tu bucket
    const fileName = `${curp}_solicitud_ingreso.pdf`; // Nombre del archivo en el storage

    try {
      const bucket = this.storage.bucket(bucketName);
      const file = bucket.file(fileName);

      // Cargar el PDF al bucket
      await file.save(pdfBuffer, {
        metadata: { contentType: 'application/pdf' },
        resumable: false,
      });

      // Generar la URL pública (opcional)
      await file.makePublic();

      // Devuelve la URL del archivo subido
      return `https://storage.googleapis.com/${bucketName}/${fileName}`;
    } catch (error) {
      console.error('Error uploading PDF to Firebase Storage:', error);
      throw new Error('Failed to upload PDF to Firebase Storage');
    }
  }

  private async savePdfInfoInFirestore(
    idAspirante: string,
    pdfUrl: string,
    curp: string,
  ) {
    await await this.firestore.collection('HojasInscripcion').add({
      id_Aspirante: idAspirante,
      url_pdf: pdfUrl,
      curpAspirante: curp,
      dateGenerated: new Date(),
    });
  }
}
