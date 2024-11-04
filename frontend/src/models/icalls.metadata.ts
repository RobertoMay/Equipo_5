import { IBaseModel } from '@shared/base-model';

export class IConvocatoria implements IBaseModel {
  id!: string; // Ensure that 'id' is part of the IBaseModel interface
  title!: string;
  startDate!: Date;
  endDate!: Date;
  cupo!: number; // Cupo total
  status!: boolean;
}
