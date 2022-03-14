import { AbstractAuditingEntity } from "./AbstractAuditingEntity";
import { BookCategory } from "./BookCategory";

export class BookSubcategory extends AbstractAuditingEntity {
    name: string = 'New book subcategory';
    description?: string;
    parentCategory?: BookCategory | ForeignKeyId;
}