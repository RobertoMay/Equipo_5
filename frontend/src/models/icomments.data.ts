import { IBaseModel } from '@shared/base-model';

export interface IComments extends IBaseModel {
  text: string;
  createdAt: string;
  createdBy: string;
}
