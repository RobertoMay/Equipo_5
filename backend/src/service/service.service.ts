import { Injectable } from '@nestjs/common';
import { firebaseDataBase } from 'src/firebase.config';
import {DataSnapshot, get, push, ref, set} from 'firebase/database';
@Injectable()
export class ServiceService {
    async createData(data: any) : Promise <void>{
        const dataRef = ref(firebaseDataBase, 'Data');
        const newElementRef = push (dataRef, {dataRef : data});
        await set(newElementRef, data);
    }

    async getData(): Promise <any> {
        const dataRef = ref (firebaseDataBase, 'Data');
        const snapshot: DataSnapshot = await get (dataRef);
        return snapshot.val();
    }
}
