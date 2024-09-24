import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
  Logger,
  BadRequestException,
} from '@nestjs/common';

import { Convocatoria } from 'src/module/modelsConvocatoria';
import { ConvocatoriaDocument } from 'src/todos/document/Convocatoria.document';
import { AppService } from 'src/service/app.service';
import { CollectionReference, QuerySnapshot } from '@google-cloud/firestore';

@Injectable()
export class ConvocatoriaService {
  private logger: Logger = new Logger(AppService.name);

  constructor(
    @Inject(ConvocatoriaDocument.collectionName)
    private convocatoriaCollection: CollectionReference<ConvocatoriaDocument>,
  ) {}

  async createConvocatoria(convocatoria: Convocatoria): Promise<any> {
    // Verificar si la convocatoria ya existe por título
    const titleQuerySnapshot: QuerySnapshot = await this.convocatoriaCollection
      .where('title', '==', convocatoria.title)
      .get();
    if (!titleQuerySnapshot.empty) {
      throw new ConflictException('La convocatoria ya está registrada');
    }

    // Generar un nuevo documento y establecer el ID
    const doc = this.convocatoriaCollection.doc();
    const id = (convocatoria.id = doc.id);
    const newConvocatoria = { ...convocatoria, id };

    // Guardar la nueva convocatoria
    await this.convocatoriaCollection.doc(id).set(newConvocatoria);
    return newConvocatoria;
  }

  async getAllConvocatorias(): Promise<any[]> {
    // Obtener todas las convocatorias
    const snapshot: QuerySnapshot = await this.convocatoriaCollection.get();
    return snapshot.docs.map((doc) => doc.data());
  }

  // Nuevo método para obtener convocatoria por título
  async getConvocatoriaByTitle(title: string): Promise<any> {
    const titleQuerySnapshot: QuerySnapshot = await this.convocatoriaCollection
      .where('title', '==', title)
      .get();

    if (titleQuerySnapshot.empty) {
      throw new NotFoundException('No se encontró convocatoria con ese título');
    }

    // Asumir que solo hay un resultado para el título dado
    return titleQuerySnapshot.docs[0].data();
  }

  async updateConvocatoriaByTitle(
    title: string,
    updatedConvocatoria: Partial<Convocatoria>
  ): Promise<void> {
    // Verifica que el título y los datos de la convocatoria a actualizar sean válidos
    if (!title || !updatedConvocatoria) {
      throw new BadRequestException('Title and updated data are required.');
    }
    const titleQuerySnapshot: QuerySnapshot = await this.convocatoriaCollection
      .where('title', '==', title)
      .get();
    if (titleQuerySnapshot.empty) {
      throw new NotFoundException('No se encontró convocatoria con ese título');
    }
    // Filtra los campos undefined antes de la actualización
    const updateData = Object.fromEntries(
      Object.entries(updatedConvocatoria).filter(([_, v]) => v !== undefined)
    );
    // Actualizar todas las convocatorias con el título dado
    const batch = this.convocatoriaCollection.firestore.batch();
    titleQuerySnapshot.docs.forEach((doc) => {
      batch.update(doc.ref, updateData);
    });
    await batch.commit();
  }

  async deleteConvocatoriaByTitle(title: string): Promise<void> {
    const titleQuerySnapshot: QuerySnapshot = await this.convocatoriaCollection
      .where('title', '==', title)
      .get();

    if (titleQuerySnapshot.empty) {
      throw new NotFoundException('No se encontró convocatoria con ese título');
    }

    // Eliminar todas las convocatorias con el título dado
    const batch = this.convocatoriaCollection.firestore.batch();
    titleQuerySnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  }
}
