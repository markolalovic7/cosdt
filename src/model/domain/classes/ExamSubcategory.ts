import { AbstractAuditingEntity } from "./AbstractAuditingEntity";

export class ExamSubcategory extends AbstractAuditingEntity {
    name: string = 'New exam subcategory';
    description?: string;
    parentCategoryId?: string;
}