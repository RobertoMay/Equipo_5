import { IBaseModel } from '@shared/base-model';

export interface IStudentEnrollmentForm extends IBaseModel {
  aspiranteId: string;
  aspiranteCurp: string;
  data: any;
}
