import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import { ConvocatoriaService } from './convocatoria.service';
import { StudenDocService } from '../service/studentdoc.service';
import { AspiranteService } from './aspirante.service';
import { DataStudentService } from './data_student.service';

@Injectable()
export class AdminService {
  private firestore: Firestore;

  constructor(
    private readonly convocatoriaService: ConvocatoriaService,
    private readonly aspiranteService: AspiranteService,
    private readonly studentDocService: StudenDocService,
    private readonly dataStudentService: DataStudentService,
  ) {
    this.firestore = new Firestore();
  }

  async getDashboardData(): Promise<any> {
    let adminName = 'Administrador no encontrado'; // Siempre inicializamos el nombre del administrador

    try {
      // Obtener el nombre del administrador
      const adminSnapshot = await this.firestore
        .collection('Aspirantes')
        .where('esAdministrador', '==', true)
        .limit(1)
        .get();

      if (!adminSnapshot.empty) {
        const adminData = adminSnapshot.docs[0].data();
        adminName = adminData.nombresCompletos;
      }

      const convocatoria = await this.convocatoriaService.getCurrentConvocatoria();
      const aspirantesSnapshot = await this.firestore.collection('Aspirantes').get();
      const aspirantes = aspirantesSnapshot.docs;

      let totalAspirantes = 0;
      let aspirantesInscritos = 0;
      let aspirantesPorInscribirse = 0;
      let aspirantesEncuestaContestada = 0;
      let aspirantesEncuestaNoContestada = 0;
      let hombresInscritos = 0;
      let mujeresInscritos = 0;
      let otrosInscritos = 0;

      for (const aspiranteDoc of aspirantes) {
        const aspiranteData = aspiranteDoc.data();

        if (!aspiranteData.esAdministrador && aspiranteData.convocatoriaId === convocatoria.id) {
          totalAspirantes++;

          let documentosCompletos = false;
          let encuestaContestada = false;

          try {
            const dataStudent = await this.dataStudentService.findByAspiranteId(aspiranteData.id);

            if (dataStudent?.data?.solicitud) {
              encuestaContestada = true;
              aspirantesEncuestaContestada++;
            } else {
              aspirantesEncuestaNoContestada++;
            }

            const studentDocsSnapshot = await this.firestore
              .collection('StudentDocDocument')
              .where('aspiranteId', '==', aspiranteData.id)
              .get();

            if (!studentDocsSnapshot.empty) {
              const studentDocData = studentDocsSnapshot.docs[0].data();
              const documentos = studentDocData.Documents || [];
              documentosCompletos =
                documentos.length === 12 &&
                documentos.every((doc) => doc.status === 'approved');
            }

            if (documentosCompletos) {
              aspirantesInscritos++;

              const genero = dataStudent?.data?.sexo?.toLowerCase().trim() || 'otro';
              if (['hombre', 'masculino'].includes(genero)) {
                hombresInscritos++;
              } else if (['mujer', 'femenino'].includes(genero)) {
                mujeresInscritos++;
              } else {
                otrosInscritos++;
              }
            } else {
              aspirantesPorInscribirse++;
            }
          } catch {
            aspirantesPorInscribirse++;
            aspirantesEncuestaNoContestada++;
          }

          if (!documentosCompletos) {
            aspirantesPorInscribirse++;
          }
        }
      }

      const plazasOcupadas = convocatoria?.occupiedCupo || 0;
      const plazasDisponibles = convocatoria?.availableCupo || 0;
      const cupoTotal = plazasOcupadas + plazasDisponibles;

      return {
        adminName, // Aquí aseguramos que siempre se devuelva
        alumnosInscritos: aspirantesInscritos,
        alumnos: {
          total: totalAspirantes,
          inscritos: aspirantesInscritos,
          porInscribirse: aspirantesPorInscribirse,
        },
        documentacion: {
          totalPorInscribirse: aspirantesPorInscribirse,
          encuestaContestada: aspirantesEncuestaContestada,
          encuestaNoContestada: aspirantesEncuestaNoContestada,
          documentosCompletos: aspirantesInscritos,
        },
        albergue: {
          cupoTotal,
          plazasOcupadas,
          plazasDisponibles,
        },
        distribucionGenero: {
          hombres: hombresInscritos,
          mujeres: mujeresInscritos,
          otros: otrosInscritos,
        },
      };
    } catch (error) {
      return {
        adminName, // Devuelve el nombre del administrador incluso en caso de error
        alumnosInscritos: 0,
        alumnos: {
          total: 0,
          inscritos: 0,
          porInscribirse: 0,
        },
        documentacion: {
          totalPorInscribirse: 0,
          encuestaContestada: 0,
          encuestaNoContestada: 0,
          documentosCompletos: 0,
        },
        albergue: {
          cupoTotal: 0,
          plazasOcupadas: 0,
          plazasDisponibles: 0,
        },
        distribucionGenero: {
          hombres: 0,
          mujeres: 0,
          otros: 0,
        },
      };
    }
  }
}
