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
  
      // 3. Consultar los documentos de todos los aspirantes en StudentDocDocument
      const studentDocsSnapshot = await this.firestore.collection('StudentDocDocument').get();
      const AspirantesSnapshot = await this.firestore.collection('Aspirantes').get();
      const aspirantes = studentDocsSnapshot.docs;
      const proceso = AspirantesSnapshot.docs;
      // 4. Filtrar y contar los aspirantes según su estado de inscripción y documentos
      let totalAspirantes = 0;
      let aspirantesInscritos = 0;
      let aspirantesNoInscritos = 0;
      let aspirantesConDocumentosCompletos = 0;
      let aspirantesConDocumentosPendientes = 0;
  
      for (const doc of aspirantes) {
        const data = doc.data();
        
        // Solo contar si el aspirante no es administrador
        if (!data.esAdministrador || data.esAdministrador === false) {
          totalAspirantes++;
          
          if (data.enrollmentStatus === true) {
            // Aspirantes inscritos
            aspirantesInscritos++;
            
            // Contar documentos completos si todos los documentos están aprobados
            const documentos = data.Documents || [];
            const allApproved = documentos.length === 12 && documentos.every(d => d.status === 'approved');
            if (allApproved) {
              aspirantesConDocumentosCompletos++;
            } else {
              aspirantesConDocumentosPendientes++;
            }
          } else {
            // Aspirantes por inscribirse
            aspirantesNoInscritos++;
          }
        }
      }
      for (const doc of proceso) {
        const data = doc.data();
        
        // Solo contar si el aspirante no es administrador
        if (!data.esAdministrador || data.esAdministrador === false) {
          totalAspirantes++;
          
          if (data.enrollmentStatus === true) {
            // Aspirantes inscritos
            aspirantesInscritos++;
            
            // Contar documentos completos si todos los documentos están aprobados
            const documentos = data.Documents || [];
            const allApproved = documentos.length === 12 && documentos.every(d => d.status === 'approved');
            if (allApproved) {
              aspirantesConDocumentosCompletos++;
            } else {
              aspirantesConDocumentosPendientes++;
            }
          } else {
            // Aspirantes por inscribirse
            aspirantesNoInscritos++;
          }
        }
      }
      // 5. Calcular ocupación del albergue
      const plazasOcupadas = convocatoria.occupiedCupo || 0;
      const plazasDisponibles = convocatoria.availableCupo || 0;
      const cupoTotal = plazasOcupadas + plazasDisponibles;
  
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
          pendientes: aspirantesNoInscritos,
        },
        albergue: {
          cupoTotal,
          plazasOcupadas,
          plazasDisponibles,
        },
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
