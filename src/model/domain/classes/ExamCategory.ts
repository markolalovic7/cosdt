import { AbstractAuditingEntity } from "./AbstractAuditingEntity";

export class ExamCategory extends AbstractAuditingEntity {
    name: string = 'New exam category';
    description?: string;
}