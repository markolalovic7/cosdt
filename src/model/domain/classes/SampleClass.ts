import { AbstractAuditingEntity } from './AbstractAuditingEntity';

export class SampleClass extends AbstractAuditingEntity {
    name: string = 'New sample';
    description?: string;
}