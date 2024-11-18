import { IBaseModel } from '@shared/base-model';

export interface IExpired extends IBaseModel {
  convocatoriaId: string;
  daysUntilDelete: number;
}
