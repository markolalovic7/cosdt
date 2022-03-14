import { AbstractAuditingEntity } from "./AbstractAuditingEntity";

export class CostCategory extends AbstractAuditingEntity {
    name: string = 'New cost category';
    description?: string;
}