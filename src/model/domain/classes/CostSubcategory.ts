import { AbstractAuditingEntity } from "./AbstractAuditingEntity";
import { CostCategory } from "./CostCategory";

export class CostSubcategory extends AbstractAuditingEntity {
    name: string = 'NewSubcategory costs';
    description?: string;
    parentCategory?: CostCategory | ForeignKeyId;
}