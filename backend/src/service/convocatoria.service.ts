import { Injectable } from '@nestjs/common';
import { GenericService } from '../service/generic.service'; // Ajusta el path según tu estructura
import { ConvocatoriaDocument } from '../todos/document/convocatoria.document';

@Injectable()
export class ConvocatoriaService extends GenericService<ConvocatoriaDocument> {
  constructor() {
    super(ConvocatoriaDocument.collectionName); // Usando la colección definida en el documento
  }
}
