import { AbstractAuditingEntity } from "./AbstractAuditingEntity";

export class BookCategory extends AbstractAuditingEntity {
    name: string = 'New book category';
    description?: string;
}