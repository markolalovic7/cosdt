export class AbstractAuditingEntity {
    id!: ObjectId;
    createdBy?: string;
    lastModifiedBy?: string;
    createdDate!: string;
    lastModifiedDate?: string;
}
