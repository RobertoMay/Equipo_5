export interface IGenericService<T> {
    findAll(): Promise<T[]>;
    findById(id: string): Promise<T>;
    create(data: T): Promise<T>;
    update(id: string, data: Partial<T>): Promise<void>;
    delete(id: string): Promise<void>;
  }
  