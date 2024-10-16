
import { AspiranteDocument } from "src/todos/document/aspirante.document";
import { TodoDocument } from "src/todos/document/todos.document"; 
import { ConvocatoriaDocument } from "src/todos/document/convocatoria.document";
import { HojasInscripcionDocument } from "src/todos/document/hojasinscripcion.document";

export const FirestoreDatabaseProvider = 'firestoredb';
export const FirestoreOptionsProvider = 'firestoreOptions';
export const FirestoreCollectionProviders: string[] = [
    TodoDocument.collectionName,
    AspiranteDocument.collectionName,
    ConvocatoriaDocument.collectionName,
    HojasInscripcionDocument.collectionName,
];
