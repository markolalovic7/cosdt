import { AbstractAuditingEntity } from "./AbstractAuditingEntity";
import { FileUpload } from "./FileUpload";

export class DataVault extends AbstractAuditingEntity {
    name: string = 'New data vault';
    description?: string;
    bucket: any;
    attachedFile?: FileUpload;
    originalFilename?: string;
    path?: string;
    id!: ObjectId;
}