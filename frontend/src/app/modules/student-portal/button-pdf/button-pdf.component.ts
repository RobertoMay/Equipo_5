import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';  
import { DataStudentService } from 'services/api/datastudent/datastudent.service'; 
import { IDataStudent, StudentData } from 'app/modules/student-portal/idata_student.metadata';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-button-pdf',
  templateUrl: './button-pdf.component.html',
  styleUrls: ['./button-pdf.component.css']
})
export class ButtonPdfComponent implements OnInit {
  aspiranteId: string | null = null;
  aspiranteData: IDataStudent | null = null;
  datos: StudentData | null = null;
  nombre: string | null = null;

  constructor(
    private route: ActivatedRoute,   
    private datastudentservice: DataStudentService
  ) {}

  ngOnInit(): void {
    const aspiranteId = localStorage.getItem('aspiranteId');
    if (!aspiranteId) {
      this.showError('ID de aspirante no encontrado. Por favor, inténtelo de nuevo.');
      return;
    }
    this.getAspiranteData();
    console.log('Datos del aspirante:', aspiranteId);
  }

  getAspiranteData(): void {
    this.aspiranteId = localStorage.getItem('aspiranteId');
    if (!this.aspiranteId) {
      console.error('No se encontró aspiranteId.');
      return;
    }
  
    this.datastudentservice.getByAspiranteId(this.aspiranteId).subscribe(
      (response) => {
        if (response) {
          this.aspiranteData = {
            id: response.id,
            aspiranteId: response.aspiranteId,
            aspiranteCurp: response.aspiranteCurp,
            data: response.data 
          } as IDataStudent;
  
          if (this.aspiranteData) {
            console.log('Datos del aspirante:', this.aspiranteData);
            console.log('Nombre del aspirante:', this.aspiranteData.data.nombre);
          } else {
            console.log('No se encontraron datos para el aspirante.');
          }
        }
      },
      (error) => {
        console.error('Error al realizar la solicitud para obtener los datos del aspirante:', error);
      }
    );
  }


  generatePDF2(): void {
    // Configura el documento en tamaño A4 (210mm x 297mm)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Cargar el contenido HTML desde el archivo en la carpeta assets
    fetch('assets/pdf-page/pdf-page.component.html')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(htmlContent => {
        // Crear un contenedor temporal para insertar el HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;

        // Obtener y aplicar los estilos del CSS del componente
        const styleElement = document.createElement('style');
        const styles = ` body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #ffffff;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
          
        }
        .footer2 {
     /* Mantiene el pie de página en una posición fija */
    bottom: 0; /* Coloca el pie de página en la parte inferior de la página */
    left: 0;
    right: 0;
    text-align: center;
    font-size: 10px; /* Tamaño de fuente para el pie de página */
    padding: 10px 0; /* Espacio alrededor del texto del pie de página */
}
.lock{
    justify-content: center; 
    text-align: center;
}

        txt{
            font-size: 14px;
            font-family:Arial, Helvetica, sans-serif;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        td {
            border: 1px solid #000;
            padding: 5px;
            font-size: 12px;
        }
        .header {
            background-color: #610f23;
            color: white;
            text-align: center;
            padding: 10px;
        }
        .subheader {
            background-color: #d9d9d9;
            font-weight: bold;
            text-align: center;
        }
        .footer {
            background-color: #ffffff;
            padding: 10px;
            font-size: 13px;
        }
        input[type="text"], input[type="date"], select {
            width: 95%;
            padding: 2px;
            border: none;
            border-bottom: 1px solid #000;
            background-color: transparent;
        }
        .checkbox-label {
            display: inline-block;
            margin-right: 10px;
        }
        .notice {
            font-size: 10px;
            text-align: center;
            margin-bottom: 10px;
            font-style: italic;
        }
        .logo {
            text-align: left;
            font-weight: bold;
            font-size: 12px;
            color: #ffffff;
        }
        h1, h2, h3 {
            margin: 5px 0;
        }
        .ceen {
            text-align: center;
        }

        `;
        styleElement.innerHTML = styles;
        tempDiv.appendChild(styleElement);

        // Sustituir datos en el HTML
        this.replacePlaceholders(tempDiv);

        // Utiliza el contenedor temporal para generar el PDF
        doc.html(tempDiv, {
          callback: (doc) => {
            // Añadir pie de página
            const pageCount = doc.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
              doc.setPage(i);
              doc.setFontSize(8);
              doc.text(
                'Este programa es ajeno a cualquier partido político. Queda prohibido el uso para fines distintos a los establecidos en el programa.',
                10, // Posición horizontal
                doc.internal.pageSize.getHeight() - 10 // Posición del pie de página
              );
            }
  // Generar el PDF como un Blob
  const pdfBlob = doc.output('blob');

  // Crear una URL para el Blob y abrirla en una nueva pestaña
  const pdfUrl = URL.createObjectURL(pdfBlob);
  
  // Intenta abrir en una nueva pestaña; si es bloqueado, sugiere al usuario permitir ventanas emergentes
  const newWindow = window.open(pdfUrl, '_blank');
  if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
    alert('Por favor, habilita las ventanas emergentes para ver el PDF.');
  }


},
          x: 2.5, // Centrar contenido horizontalmente
          y: 10, // Margen superior
          html2canvas: {
            scale: 0.25, // Ajusta el tamaño del contenido
            scrollX: 0, // Configuración adicional para evitar problemas de scroll
            scrollY: 1200
          },
          width: 180, // Ancho máximo del contenido
         
          windowWidth: 800 // Ancho simulado de la ventana del navegador
        });
      })
      .catch(err => console.error('Error al cargar el contenido HTML:', err));
  }

  private replacePlaceholders(tempDiv: HTMLDivElement): void {
    // Aquí reemplazas los marcadores de posición en el HTML con los datos del estudiante
    // Obtener la fecha actual
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0'); // Obtiene el día con 2 dígitos
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Obtiene el mes (0-11) y lo ajusta
    const year = now.getFullYear(); // Obtiene el año

    if (this.aspiranteData) {
      tempDiv.innerHTML = tempDiv.innerHTML
          .replace(/{{DD}}/g, day || 'DD')
         .replace(/{{MM}}/g, month || 'MMM')
         .replace(/{{AAAA}}/g, String(year) || 'AAAA')
        .replace(/{{nombre}}/g, this.aspiranteData.data.nombre|| '')
        .replace(/{{curp}}/g, this.aspiranteData.data.curp || 'CURP')
        .replace(/{{primerApellido}}/g, this.aspiranteData.data.primerApellido)
        .replace(/{{segundoApellido}}/g, this.aspiranteData.data.segundoApellido)
        .replace(/{{telefonoFijo}}/g, this.aspiranteData.data.telefonoFijo)
        .replace(/{{telefonoMovil}}/g, this.aspiranteData.data.telefonoMovil)
        .replace(/{{correoElectronico}}/g, this.aspiranteData.data.correoElectronico)
        .replace(/{{fechaNacimiento}}/g, this.aspiranteData.data.fechaNacimiento || 'DD/MM/AAAA')
        .replace(/{{lenguaIndigena}}/g, this.aspiranteData.data.lenguaIndigena)
        // Direccion
        .replace(/{{estado}}/g, this.aspiranteData.data.estado || '---')
        .replace(/{{municipio}}/g, this.aspiranteData.data.municipio || '---')
        .replace(/{{localidad}}/g, this.aspiranteData.data.localidad || '---')
        .replace(/{{comunidad}}/g, this.aspiranteData.data.comunidad || '---')
        // Datos Madre
        .replace(/{{curpMadre}}/g, this.aspiranteData.data.curpMadre || '---')
        .replace(/{{nombreMadre}}/g, this.aspiranteData.data.nombreMadre || '---')
        .replace(/{{primerApellidoMadre}}/g, this.aspiranteData.data.primerApellidoMadre || '---')
        .replace(/{{segundoApellidoMadre}}/g, this.aspiranteData.data.segundoApellidoMadre || '---')
        .replace(/{{fechaNacimientoMadre}}/g, this.aspiranteData.data.fechaNacimientoMadre || '---')
        .replace(/{{edoNacimientoMadre}}/g, this.aspiranteData.data.edoNacimientoMadre || '---')
        // Datos Padre
        .replace(/{{curpPadre}}/g, this.aspiranteData.data.curpPadre || '---')
        .replace(/{{nombrePadre}}/g, this.aspiranteData.data.nombrePadre || '---')
        .replace(/{{primerApellidoPadre}}/g, this.aspiranteData.data.primerApellidoPadre || '---')
        .replace(/{{segundoApellidoPadre}}/g, this.aspiranteData.data.segundoApellidoPadre || '---')
        .replace(/{{fechaNacimientoPadre}}/g, this.aspiranteData.data.fechaNacimientoPadre || '---')
        .replace(/{{edoNacimientoPadre}}/g, this.aspiranteData.data.edoNacimientoPadre || '---')
        // Datos tutor
        .replace(/{{nombreTutor}}/g, this.aspiranteData.data.nombreTutor || '---')
        .replace(/{{curpTutor}}/g, this.aspiranteData.data.curpTutor || '---')
        .replace(/{{parentescoTutor}}/g, this.aspiranteData.data.parentescoTutor || '---')
        .replace(/{{primerApellidoTutor}}/g, this.aspiranteData.data.primerApellidoTutor || '---')
        .replace(/{{segundoApellidoTutor}}/g, this.aspiranteData.data.segundoApellidoTutor || '---')
        .replace(/{{fechaNacimientoTutor}}/g, this.aspiranteData.data.fechaNacimientoTutor || '---')
        .replace(/{{edoNacimientoTutor}}/g, this.aspiranteData.data.edoNacimientoTutor || '---')
        // Datos Casa Comedor
        .replace(/{{comunidadCasa}}/g, this.aspiranteData.data.comunidadCasa || '---')
        .replace(/{{localidadCasa}}/g, this.aspiranteData.data.localidadCasa || '---')
        .replace(/{{centroCoordinador}}/g, this.aspiranteData.data.centroCoordinador || '---')
        .replace(/{{nombreCasa}}/g, this.aspiranteData.data.nombreCasa || '---')
        // Traslado de la casa-comunidad de origen
        .replace(/{{especifAcceso}}/g, this.aspiranteData.data.especifAcceso || ' ')
        .replace(/{{especifRiesgo}}/g, this.aspiranteData.data.especifRiesgo || ' ')
        // Discapacidades
        .replace(/{{especifDiscapacidad}}/g, this.aspiranteData.data.especifDiscapacidad || ' ')
        // Datos Académicos
        .replace(/{{cct}}/g, this.aspiranteData.data.cct || ' ')
        .replace(/{{nombreEscuela}}/g, this.aspiranteData.data.nombreEscuela || ' ')
        .replace(/{{escolaridad}}/g, this.aspiranteData.data.escolaridad || '---')
        .replace(
          /{{semestreoanosCursados}}/g,
          this.aspiranteData.data.semestreoanosCursados || '---',
        )
        .replace(/{{tipoCurso}}/g, this.aspiranteData.data.tipoCurso || '---')
        // Salud
        .replace(/{{alergiaDetalles}}/g, this.aspiranteData.data.alergiaDetalles || ' ')
        .replace(/{{respirarDetalles}}/g, this.aspiranteData.data.respirarDetalles || ' ')
        .replace(/{{tratamientoDetalles}}/g, this.aspiranteData.data.tratamientoDetalles || ' ');
  
    
// Función genérica para reemplazar dinámicamente los checkboxes
function replaceCheckbox(populatedHtml: string, mapping: any, key: string): string {
  const checkboxId = mapping[key];
  if (checkboxId) {
    const regex = new RegExp(`<input type="checkbox" id="${checkboxId}-checkbox">`, 'g');
    console.log(regex);
    return populatedHtml.replace(regex, `<input type="checkbox" id="${checkboxId}-checkbox" checked>`);
  }
 
  return populatedHtml;
 
}
// Uso del objeto aspiranteData para ajustar los valores de los checkboxes
if (this.aspiranteData) {
  const data = this.aspiranteData.data;
  let populatedHtml = tempDiv.innerHTML;

  // Datos mapeados
  const pueblosIndigenas = {
    Pueblo1: 'indigena',
    Pueblo2: 'afromexicano',
  };

  const sexos = {
    Mujer: 'mujer',
    Hombre: 'hombre',
    Otro: 'otro',
  };

  const estados = {
    finado: 'finado',
    ausente: 'ausente',
    vivo: 'vivo',
  };

  const estadosm= {
    finado: 'finadom',
    ausente: 'ausentem',
    vivo: 'vivom',
  };

  const tiposCasa = {
    Casa: 'casa',
    Comedor: 'comedor',
    'Escolar de la niñez': 'niñez',
    'Comunitario del estudiante': 'comunit',
    Universitario: 'universitario',
  };

  const mediosAcceso = {
    'A pie': 'pie',
    'En bicicleta': 'bici',
    'En vehículo': 'vehi',
    Otro: 'otrov',
  };

  const riesgosAcceso = {
    Deslaves: 'des',
    Barrancas: 'barrancas',
    'Rio crecido': 'rio',
    Inundación: 'inundacion',
    Otro: 'otror',
  };
  const discapacidad = {
    Sí: 'dsi',
    No: 'dno',
  };
  const respirar = {
    Sí: 'resi',
    No: 'reno',
  };
  const tratamiento = {
    Sí: 'tmsi',
    No: 'tmno',
  };
  const alergia = {
    Sí: 'alsi',
    No: 'alno',
  };
  const tipoEscuela = {
    Pública: 'publica',
    Comunitaria: 'comunitaria',
  };

  const tiposDiscapacidad = {
    Motriz: 'mot',
    Auditivo: 'aud',
    Visual: 'vis',
    Mental: 'men',
    Otro: 'otrod',
  };
  const solicitud = {
    1: '1',
    2: '2',
    3: '3',

  };

  // Reemplazo dinámico utilizando la función genérica
  populatedHtml = replaceCheckbox(populatedHtml, pueblosIndigenas, data.puebloIndigena);
  populatedHtml = replaceCheckbox(populatedHtml, sexos, this.aspiranteData.data.sexo);
  populatedHtml = replaceCheckbox(populatedHtml, estadosm, this.aspiranteData.data.estadoMadre);
  populatedHtml = replaceCheckbox(populatedHtml, estados, this.aspiranteData.data.estadoPadre);
  populatedHtml = replaceCheckbox(populatedHtml, tiposCasa, this.aspiranteData.data.tipoCasa);
  populatedHtml = replaceCheckbox(populatedHtml, mediosAcceso, this.aspiranteData.data.medioAcceso);
  populatedHtml = replaceCheckbox(populatedHtml, riesgosAcceso, this.aspiranteData.data.riesgoAcceso);
  populatedHtml = replaceCheckbox(populatedHtml, discapacidad, this.aspiranteData.data.discapacidad);
  populatedHtml = replaceCheckbox(populatedHtml, tiposDiscapacidad, this.aspiranteData.data.tipoDiscapacidad);
  populatedHtml = replaceCheckbox(populatedHtml, tipoEscuela, this.aspiranteData.data.tipoEscuela);
  populatedHtml = replaceCheckbox(populatedHtml, alergia, this.aspiranteData.data.alergia);
  populatedHtml = replaceCheckbox(populatedHtml, tratamiento, this.aspiranteData.data.tratamiento);
  populatedHtml = replaceCheckbox(populatedHtml, respirar, this.aspiranteData.data.respirar);
  populatedHtml = replaceCheckbox(populatedHtml, solicitud, this.aspiranteData.data.solicitud);

  // Actualización final del contenido del div
  tempDiv.innerHTML = populatedHtml;

  }
}

  }


  showError(message: string): void {
    alert(message);  
  }

}
