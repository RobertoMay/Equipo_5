import { IBaseModel } from '@shared/base-model';

export interface IConvocatorias extends IBaseModel {
  isOpen: boolean;
  endDate: Date;
  startDate: Date;
}
