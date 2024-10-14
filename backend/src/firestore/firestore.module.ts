import { Module, DynamicModule } from '@nestjs/common';
import { Firestore, Settings } from '@google-cloud/firestore';
import {
    FirestoreDatabaseProvider,
    FirestoreOptionsProvider,
    FirestoreCollectionProviders,
} from './firestore.providers'

type FirestoreModuleOptions = {
    imports: any[];
    useFactory: (...args: any[]) => Settings;
    inject: any[];
};

@Module({
    providers: [
        {
          provide: Firestore,
          useFactory: () => {
            // Configuración de Firestore aquí
            return new Firestore();
          },
        },
      ],
      exports: [Firestore], // Exporta Firestore para que otros módulos puedan utilizarlo


})
export class FirestoreModule{
    static forRoot(options: FirestoreModuleOptions): DynamicModule{
        const optionsProvider = {
            provide: FirestoreOptionsProvider,
            useFactory: options.useFactory,
            inject: options.inject,
        };
        const dbProvider = {
            provide: FirestoreDatabaseProvider,
            useFactory: (config: Settings) => new Firestore(config),
            inject: [FirestoreOptionsProvider],
        };
        const collectionProviders = FirestoreCollectionProviders.map(providerName => ({
            provide: providerName,
            useFactory: (db: { collection: (arg0: string) => any; }) => db.collection(providerName),
            inject: [FirestoreDatabaseProvider],
        }));
        return{
            global: true,
            module: FirestoreModule,
            imports: options.imports,
            providers: [optionsProvider, dbProvider, ...collectionProviders],
            exports: [dbProvider, ...collectionProviders],
        };
    }
}


