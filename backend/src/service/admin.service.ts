import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import { ConvocatoriaService } from './convocatoria.service';
import { StudenDocService } from '../service/studentdoc.service';
import { AspiranteService } from './aspirante.service';

@Injectable()
export class AdminService {
  private firestore: Firestore;

  constructor(
    private readonly convocatoriaService: ConvocatoriaService,
    private readonly aspiranteService: AspiranteService,
    private readonly studentDocService: StudenDocService
  ) {
    this.firestore = new Firestore();
  }

  async getDashboardData(): Promise<any> {
    try {
      // 1. Obtener el nombre del administrador
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

      // 2. Obtener la convocatoria activa
      const convocatoria = await this.convocatoriaService.getCurrentConvocatoria();

      // 3. Obtener solo los aspirantes que no son administradores o no tienen el campo `esAdministrador`
      const aspirantesSnapshot = await this.firestore.collection('Aspirantes').get();
      const aspirantes = aspirantesSnapshot.docs.filter(doc => {
        const data = doc.data();
        return !data.esAdministrador || data.esAdministrador === false;
      });

      const totalAspirantes = aspirantes.length;
      const aspirantesInscritos = aspirantes.filter(doc => doc.data().statusinscripcion === true).length;
      const aspirantesNoInscritos = totalAspirantes - aspirantesInscritos;

      // 4. Calcular documentos completos y pendientes, excluyendo a los administradores
      let aspirantesConDocumentosCompletos = 0;
      let aspirantesConDocumentosPendientes = 0;

      for (const doc of aspirantes) {
        const aspiranteId = doc.id;
        try {
          const documentos = await this.studentDocService.getDocumentsByAspiranteId(aspiranteId);
          if (documentos.length === 12) {
            aspirantesConDocumentosCompletos++;
          } else {
            aspirantesConDocumentosPendientes++;
          }
        } catch (error) {
          // Mostrar solo el mensaje resumido en caso de error
          if (error instanceof HttpException && error.getStatus() === HttpStatus.NOT_FOUND) {
            console.log(`Error al obtener documentos por aspiranteId: No se encontraron documentos para el aspirante con ID: ${aspiranteId}`);
          } else {
            console.error('Error inesperado al obtener documentos:', error.message);
          }
          aspirantesConDocumentosPendientes++; // Si no hay documentos, se considera pendiente
        }
      }

      // 5. Calcular ocupación del albergue
      const plazasOcupadas = convocatoria.occupiedCupo || 0;
      const plazasDisponibles = convocatoria.availableCupo || 0;
      const cupoTotal = plazasOcupadas + plazasDisponibles; // Calcular cupoTotal como occupiedCupo + availableCupo

      // 6. Retornar los datos procesados
      return {
        adminName,
        alumnos: {
          total: totalAspirantes,
          inscritos: aspirantesInscritos,
          porInscribirse: aspirantesNoInscritos,
        },
        documentos: {
          porInscribirse: aspirantesNoInscritos,
          completos: aspirantesConDocumentosCompletos,
          pendientes: aspirantesConDocumentosPendientes
        },
        albergue: {
          cupoTotal,
          plazasOcupadas,
          plazasDisponibles
        }
      };

    } catch (error) {
      console.error('Error al obtener datos del tablero:', error.message);
      throw new HttpException(
        { message: 'Error al obtener datos del tablero', details: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
