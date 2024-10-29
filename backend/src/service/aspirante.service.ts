import { Injectable, ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { Firestore, QuerySnapshot } from '@google-cloud/firestore';
import { AspiranteDocument } from '../todos/document/aspirante.document';
import * as jwt from 'jsonwebtoken';
import { AuthResult } from 'src/module/auth-result.interface';
import { ConvocatoriaDocument } from 'src/todos/document/convocatoria.document';
import { ConvocatoriaService } from './convocatoria.service';

@Injectable()
export class AspiranteService {
  private firestore: Firestore;

  constructor(
    private readonly convocatoriaService: ConvocatoriaService // Inyecta el servicio de convocatoria
  ) {
    
    this.firestore = new Firestore();
  }
  
  

  
  // Verificar duplicados de CURP y correo electrónico
  private async checkDuplicates(curp: string, correo: string): Promise<boolean> {
    const snapshot = await this.firestore.collection('aspirantes')
      .where('curp', '==', curp)
      .where('correo', '==', correo)
      .get();

    return !snapshot.empty;
  }
 
// Crear un nuevo aspirante con verificación de cupos disponibles y actualización de cupos ocupados
async createAspirante(aspirante: AspiranteDocument): Promise<AspiranteDocument> {
  try {
    const aspirantesCollection = this.firestore.collection(AspiranteDocument.collectionName);

    // Verificación de duplicados en CURP y correo
    const existingCurpQuerySnapshot: QuerySnapshot = await aspirantesCollection.where('curp', '==', aspirante.curp).get();
    if (!existingCurpQuerySnapshot.empty) {
      throw new ConflictException('El CURP ya está registrado.');
    }

    const existingCorreoQuerySnapshot: QuerySnapshot = await aspirantesCollection.where('correo', '==', aspirante.correo).get();
    if (!existingCorreoQuerySnapshot.empty) {
      throw new ConflictException('El correo electrónico ya está registrado.');
    }

    // Obtener convocatoria abierta actual
    const convocatoriaAbierta = await this.convocatoriaService.getCurrentConvocatoria();

    // Verificar que haya cupos disponibles
    if (convocatoriaAbierta.availableCupo <= 0) {
      throw new HttpException('No quedan cupos disponibles en la convocatoria.', HttpStatus.BAD_REQUEST);
    }

    // Crear el aspirante y asignar el ID de la convocatoria abierta
    const docRef = aspirantesCollection.doc();
    const id = docRef.id;
    const newAspirante = {
      ...aspirante,
      id,
      convocatoriaId: convocatoriaAbierta.id,
    };

    await docRef.set(newAspirante);

    // Reducir el availableCupo, el cupo total, y aumentar el occupiedCupo
    await this.convocatoriaService.updateCuposOnInscription(
      convocatoriaAbierta.id,
      convocatoriaAbierta.cupo - 1,
      convocatoriaAbierta.availableCupo - 1,
      (convocatoriaAbierta.occupiedCupo || 0) + 1
    );

    return newAspirante;
  } catch (error) {
    console.error('Error al crear el aspirante:', error.message);
    throw error; // Re-lanza el error para el controlador
  }
}


  // Autenticar al usuario y generar un token
  async authenticate(correo: string, curp: string): Promise<AuthResult & { id: string }> {
    const snapshot = await this.firestore.collection('Aspirantes')
      .where('correo', '==', correo)
      .where('curp', '==', curp)
      .get();
  
    if (snapshot.empty) {
      throw new ConflictException('Usuario no encontrado o credenciales incorrectas');
    }
  
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
  
    return {
      id: userDoc.id,  // Agrega el id del documento aquí
      nombresCompletos: userData.nombresCompletos,
      esAdministrador: userData.esAdministrador || false
    };
  }
  
  // Obtener todos los aspirantes
  async getAllAspirantes(): Promise<AspiranteDocument[]> {
    const snapshot = await this.firestore.collection('Aspirantes').get();
    if (snapshot.empty) {
      throw new HttpException('No se encontraron aspirantes', HttpStatus.NOT_FOUND);
    }

    const aspirantes: AspiranteDocument[] = [];
    snapshot.forEach(doc => {
      aspirantes.push(doc.data() as AspiranteDocument);
    });

    return aspirantes;
  }

  // Obtener un aspirante por ID
  async getAspiranteById(id: string): Promise<AspiranteDocument> {
    const doc = await this.firestore.collection('Aspirantes').doc(id).get();
    if (!doc.exists) {
      throw new HttpException('Aspirante no encontrado', HttpStatus.NOT_FOUND);
    }

    return doc.data() as AspiranteDocument;
  }

  // Actualizar un aspirante por ID
  async updateAspirante(id: string, aspiranteDto: Partial<AspiranteDocument>): Promise<void> {
    const docRef = this.firestore.collection('Aspirantes').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new HttpException('Aspirante no encontrado', HttpStatus.NOT_FOUND);
    }

    await docRef.update(aspiranteDto);
  }

 // Eliminar un aspirante por ID y actualizar los cupos en la convocatoria
async deleteAspirante(id: string): Promise<void> {
  const docRef = this.firestore.collection('Aspirantes').doc(id);

  // Verificar si el aspirante existe
  const doc = await docRef.get();
  if (!doc.exists) {
    throw new HttpException('Aspirante no encontrado', HttpStatus.NOT_FOUND);
  }

  // Obtener los datos del aspirante, incluyendo el ID de la convocatoria
  const aspirante = doc.data() as AspiranteDocument;
  const convocatoriaId = aspirante.convocatoriaId;

  // Eliminar el aspirante
  await docRef.delete();

  // Verificar y actualizar los cupos en la convocatoria correspondiente
  const convocatoria = await this.convocatoriaService.getById(convocatoriaId);

  if (convocatoria) {
    // Incrementar el availableCupo y cupo en 1, y reducir occupiedCupo en 1
    const newAvailableCupo = convocatoria.availableCupo + 1;
    const newCupo = convocatoria.cupo + 1;
    const newOccupiedCupo = Math.max((convocatoria.occupiedCupo || 0) - 1, 0);

    await this.convocatoriaService.updateCuposOnDeletion(convocatoriaId, newCupo, newAvailableCupo, newOccupiedCupo);
  }
}


  // Obtener un aspirante por CURP
async getAspiranteByCurp(curp: string): Promise<string> {
  console.log(`Buscando aspirante con CURP: ${curp}`); 
  const snapshot = await this.firestore.collection('Aspirantes')
    .where('curp', '==', curp)
    .get();

  if (snapshot.empty) {
    throw new HttpException('Aspirante no encontrado', HttpStatus.NOT_FOUND);
  }

  const aspiranteDoc = snapshot.docs[0];
  return aspiranteDoc.id;
}
}
