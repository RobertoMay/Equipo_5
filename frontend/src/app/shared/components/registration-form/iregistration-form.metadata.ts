import { IBaseModel } from '@shared/base-model';

export interface IRegistration extends IBaseModel {
  nombresCompletos: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  curp: string;
  correo: string;
}
