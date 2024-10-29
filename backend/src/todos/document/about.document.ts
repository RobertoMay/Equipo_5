export class AboutDocument {
    static collectionName = 'About'; // Nombre de la colección en Firestore
    id: string;
    mission: string;
    vision: string;
    directorName: string;
  
    constructor(partial: Partial<AboutDocument>) {
      Object.assign(this, partial);
    }
  }
  