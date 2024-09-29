import { IBaseModel } from '@shared/base-model';

export interface ILogin extends IBaseModel {
  correo: string;
  curp: string;
}

