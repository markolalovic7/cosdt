import { BrowserFile } from "../../../shared/components/file-upload/FileUpload";
import { FileUploadEntityEnum } from "../enums/FileUploadEntityEnum";
import { AbstractAuditingEntity } from "./AbstractAuditingEntity";

export class FileUpload extends AbstractAuditingEntity {
    name?: string;
    description?: string;
    bucket?: string;
    entity?: FileUploadEntityEnum;
    mime?: string;
    originalFilename?: string;
    path?: string;
    size?: number;
    browserFile?: BrowserFile;
}