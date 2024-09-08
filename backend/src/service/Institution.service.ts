//institution.service.ts
import { BadRequestException, ConflictException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Institution } from 'src/module/modelsInstitution';
import { InstitutionDocument } from 'src/todos/document/institution.document';
import { AppService } from 'src/service/app.service';
import { CollectionReference, DocumentData, DocumentSnapshot, QueryDocumentSnapshot, QuerySnapshot } from '@google-cloud/firestore';

@Injectable()
export class InstitutionService {
  private logger: Logger = new Logger(AppService.name);

  constructor(
    @Inject(InstitutionDocument.collectionName)
    private institutionCollection: CollectionReference<InstitutionDocument>,
  ) {}

  async createInstitution(institution : Institution): Promise<any> {
    if (!institution || !institution.name) {
        throw new BadRequestException('Se requiere un nombre de institución');
    }
    // const querySnapshot = await this.institutionCollection.get();
    // const numberOfInstitution = querySnapshot.size;
    const nameQuerySnapshot: QuerySnapshot = await this.institutionCollection.where('name', '==', institution.name).get();
    if (!nameQuerySnapshot.empty) {
      throw new ConflictException('La institución ya esta registrada');
    }
    // const newInstitutionId = numberOfInstitution + 1;
    const doc = await this.institutionCollection.doc();
    const id = institution.id = doc.id;
    const surveys = {
      ...institution,
    };
    await this.institutionCollection.doc(id).set(surveys);
    return surveys;
  }

  async getAllInstitutions(): Promise<any[]> {
    const snapshot: QuerySnapshot = await this.institutionCollection.get();
    const institutions = snapshot.docs.map((doc) => doc.data());
    return institutions;
  }

  async getInstitutionById(institutionId: string): Promise<any> {
    const institutionDoc: DocumentSnapshot = await this.institutionCollection.doc(institutionId).get();
    if (!institutionDoc.exists) {
      throw new ConflictException('Institución no encontrada');
    }
    return institutionDoc.data();
  }

  async deleteInstitutionById(institutionId: string): Promise<void> {
    const institutionDoc: DocumentSnapshot = await this.institutionCollection.doc(institutionId).get();
    if (!institutionDoc.exists) {
      throw new ConflictException('Institución no encontrada');
    }
    await this.institutionCollection.doc(institutionId).delete();
  }

  async updateInstitutionName(institutionId: string, updatedInstitutionName: any): Promise<any> {
    const institutionDoc: DocumentSnapshot = await this.institutionCollection.doc(institutionId).get();
    if (!institutionDoc.exists) {
      throw new ConflictException('Institución no encontrada');
    }
    await this.institutionCollection.doc(institutionId).update(updatedInstitutionName);
    return { message: 'Nombre actualizado con éxito' };
  }
}