import { AbstractAuditingEntity } from "./AbstractAuditingEntity";
import { CostCategory } from "./CostCategory";
import { CostSubcategory } from "./CostSubcategory";
import { FileUpload } from "./FileUpload";
import { Seminar } from "./Seminar";

export class SeminarCost extends AbstractAuditingEntity {
    name: string = 'New Seminar cost';
    description?: string;
    category?: CostCategory | ForeignKeyId;
    subCategory?: CostSubcategory | ForeignKeyId;
    attachedFile?: FileUpload;
    amount?: number;
    seminar?: Seminar | ForeignKeyId;
}