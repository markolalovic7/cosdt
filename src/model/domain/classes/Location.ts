import { AbstractAuditingEntity } from './AbstractAuditingEntity';

export class Location extends AbstractAuditingEntity {
    name: string = 'New location';
    description?: string;
}