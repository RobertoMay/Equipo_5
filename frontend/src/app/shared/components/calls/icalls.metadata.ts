import { IBaseModel } from '@shared/base-model';

export class IConvocatoria implements IBaseModel {
    id!: number; // Ensure that 'id' is part of the IBaseModel interface
    title!: string;
    startDate!: Date;
    endDate!: Date;
    status!: boolean;
}