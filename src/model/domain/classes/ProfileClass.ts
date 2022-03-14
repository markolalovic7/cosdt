import { AbstractAuditingEntity } from "./AbstractAuditingEntity";

export class ProfileClass extends AbstractAuditingEntity {
    name: string = 'New profile class';
    description?: string;
}