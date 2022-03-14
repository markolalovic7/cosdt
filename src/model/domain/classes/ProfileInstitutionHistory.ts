import { AbstractAuditingEntity } from "./AbstractAuditingEntity";

export class ProfileInstitutionHistory extends AbstractAuditingEntity {
    name: string = "";
    description?: string;
}