import { AbstractAuditingEntity } from "./AbstractAuditingEntity";
import { SeminarCategory } from "./SeminarCategory";

export class SeminarSubcategory extends AbstractAuditingEntity {
    name: string = 'New seminar subcategory';
    description?: string;
    parentCategory?: SeminarCategory | ForeignKeyId;
}