import { Timestamp } from "@google-cloud/firestore";

export class TodoDocument{
    static collectionName = 'todos';
    id: string;
    name: string;
    dueDate: Timestamp;
}
