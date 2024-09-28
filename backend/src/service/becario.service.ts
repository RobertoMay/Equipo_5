import { Injectable } from '@nestjs/common';
import { GenericService } from '../service/generic.service'; // Ajusta el path según tu estructura
import { BecarioDocument } from 'src/todos/document/becario.document';

@Injectable()
export class BecarioService extends GenericService<BecarioDocument> {
  constructor() {
    super('Becarios'); // Nombre de la colección en Firestore
  }
}
