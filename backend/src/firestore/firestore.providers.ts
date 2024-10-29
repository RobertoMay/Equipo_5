import { AspiranteDocument } from 'src/todos/document/aspirante.document';

import { TodoDocument } from 'src/todos/document/todos.document';
import { ConvocatoriaDocument } from 'src/todos/document/convocatoria.document';

import { DataStudent } from 'src/todos/document/data_student.document';
import { StudentDocDocument } from 'src/todos/document/studentdoc.document';
import { AboutDocument } from 'src/todos/document/about.document';

export const FirestoreDatabaseProvider = 'firestoredb';
export const FirestoreOptionsProvider = 'firestoreOptions';
export const FirestoreCollectionProviders: string[] = [
  TodoDocument.collectionName,
  AspiranteDocument.collectionName,
  ConvocatoriaDocument.collectionName,
  DataStudent.collectionName,
  StudentDocDocument.collectionName,
  AboutDocument.collectionName,
];
