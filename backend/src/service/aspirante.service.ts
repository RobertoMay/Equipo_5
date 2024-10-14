import { Injectable, ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { Firestore, QuerySnapshot } from '@google-cloud/firestore';
import { AspiranteDocument } from '../todos/document/aspirante.document';
import * as jwt from 'jsonwebtoken';
import { AuthResult } from 'src/module/auth-result.interface';

@Injectable()
export class AspiranteService {
  private firestore: Firestore;

  constructor() {
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

  // Crear un nuevo aspirante
  async createAspirante(aspirante: AspiranteDocument): Promise<AspiranteDocument> {
    try {
      const aspirantesCollection = this.firestore.collection(AspiranteDocument.collectionName);

      // Verifica si el CURP ya existe
      const existingCurpQuerySnapshot: QuerySnapshot = await aspirantesCollection.where('curp', '==', aspirante.curp).get();
      if (!existingCurpQuerySnapshot.empty) {
        throw new ConflictException('El CURP ya está registrado.');
      }

      // Verifica si el correo ya existe
      const existingCorreoQuerySnapshot: QuerySnapshot = await aspirantesCollection.where('correo', '==', aspirante.correo).get();
      if (!existingCorreoQuerySnapshot.empty) {
        throw new ConflictException('El correo electrónico ya está registrado.');
      }

      // Crea el nuevo aspirante
      const docRef = await aspirantesCollection.doc();
      const id = docRef.id;
      const newAspirante = {
        ...aspirante,
        id,
      };

      await docRef.set(newAspirante);
      return newAspirante;
    } catch (error) {
      throw error; // Re-lanza el error para que el controlador pueda manejarlo
    }
  }
  // Autenticar al usuario y generar un token
  async authenticate(correo: string, curp: string): Promise<AuthResult> {
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
      nombresCompletos: userData.nombresCompletos, // Asegúrate de que esta propiedad existe
      esAdministrador: userData.esAdministrador || false, // Devuelve si es administrador
    };
  }
  // Obtener todos los aspirantes
  async getAllAspirantes(): Promise<AspiranteDocument[]> {
    const snapshot = await this.firestore.collection('aspirantes').get();
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
    const doc = await this.firestore.collection('aspirantes').doc(id).get();
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

  // Eliminar un aspirante por ID
  async deleteAspirante(id: string): Promise<void> {
    const docRef = this.firestore.collection('aspirantes').doc(id);

    const doc = await docRef.get();
    if (!doc.exists) {
      throw new HttpException('Aspirante no encontrado', HttpStatus.NOT_FOUND);
    }

    await docRef.delete();
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
