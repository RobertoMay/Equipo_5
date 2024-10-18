import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';  
import { DataStudentService } from 'services/api/datastudent/datastudent.service'; 
import { IDataStudent, StudentData } from 'app/modules/student-portal/idata_student.metadata';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-pdf-page',
  templateUrl: './pdf-page.component.html',
  styleUrls: ['./pdf-page.component.css']
})
export class PdfPageComponent implements OnInit {
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

  generatePDF(): void {
    const element = document.getElementById('pdf-content');

    if (element && this.aspiranteData?.aspiranteCurp) {
        const A4_WIDTH = 210;  // Ancho en mm para formato A4
        const A4_HEIGHT = 297; // Alto en mm para formato A4
        const FOOTER_HEIGHT = 15; // Altura del pie de página en mm
        const MARGIN_TOP = 20; // Margen superior en mm
        const MARGIN_BOTTOM = 25; // Margen inferior en mm
        const MARGIN_LEFT_RIGHT = 10; // Margen lateral en mm

        // Obtener las secciones del contenido
        const sections = element.children; // Asegúrate de que cada sección esté en un contenedor hijo
        const pdf = new jsPDF('p', 'mm', 'a4'); // PDF con formato A4 en mm, orientación vertical

        // Función para agregar pie de página
        const addFooter = (pdf: jsPDF, pageNumber: number) => {
            pdf.setFontSize(10);
            pdf.text(`Página ${pageNumber}`, A4_WIDTH / 2, A4_HEIGHT - FOOTER_HEIGHT + 5, { align: 'center' });
            pdf.text(`Instituto Nacional de los Pueblos Indígenas`, A4_WIDTH / 2, A4_HEIGHT - FOOTER_HEIGHT + 10, { align: 'center' });
        };

        let pageNumber = 1;

        // Iterar sobre cada sección
        for (let i = 0; i < sections.length; i++) {
          const section = sections[i] as HTMLElement; // Asegúrate de que sea tratado como HTMLElement
      
          // Crear un nuevo canvas para cada sección
          html2canvas(section, { scale: 1 }).then((canvas) => {
              const imgWidth = A4_WIDTH - 2 * MARGIN_LEFT_RIGHT; // Ajustar el ancho por los márgenes laterales
              const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
              // Agregar la imagen al PDF
              pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', MARGIN_LEFT_RIGHT, MARGIN_TOP, imgWidth, imgHeight);
              addFooter(pdf, pageNumber); // Agrega el pie de página
      
              // Verificar si hay más contenido para agregar
              if (i < sections.length - 1) {
                  pdf.addPage(); // Agregar una nueva página si no es la última sección
                  pageNumber++; // Incrementar número de página
              }
      
              // Si es la última sección, guardar el PDF
              if (i === sections.length - 1) {
                  pdf.save(`${this.aspiranteData?.aspiranteCurp}.pdf`);
              }
          });
      }
      
    } else {
        console.error('No se encontró el contenido HTML o CURP para generar el PDF.');
    }
}
generatePDF2(): void {
  // Configura el documento en tamaño A4 (210mm x 297mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pdfContent = document.getElementById('pdf-content');
  if (pdfContent) {
    doc.html(pdfContent, {
      callback: (doc) => {
        // Añadir pie de página
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(10);
          doc.text(
            `Página ${i} de ${pageCount}`,
            doc.internal.pageSize.getWidth() - 30,
            doc.internal.pageSize.getHeight() - 10 // Posición del pie de página
          );
        }
        // Guardar el PDF
        doc.save('pdf.pdf');
      },
      x: 10, // Centrar contenido horizontalmente
      y: 10, // Margen superior
      html2canvas: {
        scale: 0.24, // Ajusta el tamaño del contenido
      },
      width: 180, // Ancho máximo del contenido
      windowWidth: 900 // Ancho simulado de la ventana del navegador
    });
  }
}




  showError(message: string): void {
    alert(message);  
  }

}
