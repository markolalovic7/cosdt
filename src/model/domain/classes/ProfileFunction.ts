import { AbstractAuditingEntity } from "./AbstractAuditingEntity";

export class ProfileFunction extends AbstractAuditingEntity {
    name: string = 'New profile function';
    namef: string = 'New profile function';
    description?: string;
}
