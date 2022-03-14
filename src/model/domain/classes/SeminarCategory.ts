import { AbstractAuditingEntity } from "./AbstractAuditingEntity";

export class SeminarCategory extends AbstractAuditingEntity {
    name: string = 'New seminar category';
    description?: string;
}