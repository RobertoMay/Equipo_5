import { IBaseModel } from '@shared/base-model';

export interface IComments extends IBaseModel {
  comment: string;
  createdAt: string;
  createdBy: string;
}
