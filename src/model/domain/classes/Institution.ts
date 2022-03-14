import { AbstractAuditingEntity } from "./AbstractAuditingEntity";

export class Institution extends AbstractAuditingEntity {
    name: string = 'New institution';
    description?: string;
}