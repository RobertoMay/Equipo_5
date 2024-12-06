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
    try {
      const adminSnapshot = await this.firestore
        .collection('Aspirantes')
        .where('esAdministrador', '==', true)
        .limit(1)
        .get();

      if (adminSnapshot.empty) {
        throw new HttpException('No se encontró administrador', HttpStatus.NOT_FOUND);
      }

      const adminData = adminSnapshot.docs[0].data();
      const adminName = adminData.nombresCompletos;

      const convocatoria = await this.convocatoriaService.getCurrentConvocatoria();
      const aspirantesSnapshot = await this.firestore.collection('Aspirantes').get();
      const aspirantes = aspirantesSnapshot.docs;

      // Variables de conteo
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

            // Encuesta contestada
            if (dataStudent?.data?.solicitud) {
              encuestaContestada = true;
              aspirantesEncuestaContestada++;
            } else {
              aspirantesEncuestaNoContestada++;
            }

            // Documentos completos
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

              // Distribución de género
              const genero = dataStudent?.data?.sexo?.toLowerCase().trim() || 'otro';
              if (['hombre', 'masculino'].includes(genero)) {
                hombresInscritos++;
              } else if (['mujer', 'femenino'].includes(genero)) {
                mujeresInscritos++;
              } else {
                otrosInscritos++;
              }
            } else {
              // Solo contar como pendiente si no está inscrito
              aspirantesPorInscribirse++;
            }
          } catch {
            // Si ocurre un error, considerar como pendiente y encuesta no contestada
            aspirantesPorInscribirse++;
            aspirantesEncuestaNoContestada++;
          }
        }
      }

      const plazasOcupadas = convocatoria.occupiedCupo || 0;
      const plazasDisponibles = convocatoria.availableCupo || 0;
      const cupoTotal = plazasOcupadas + plazasDisponibles;

      return {
        adminName,
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
      throw new HttpException(
        { message: 'Error al obtener datos del tablero', details: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
