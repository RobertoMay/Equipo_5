import { Injectable } from '@nestjs/common';
import { GenericService } from '../service/generic.service'; // Ajusta el path según tu estructura
import { StudentDocDocument } from '../todos/document/studentdoc.document';

@Injectable()
export class StudenDocService extends GenericService<StudentDocDocument> {
  constructor() {
    super(StudentDocDocument.collectionName); // Usando la colección definida en el documento
  }
}
