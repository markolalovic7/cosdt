import { AbstractAuditingEntity } from "./AbstractAuditingEntity";
import { BookCategory } from "./BookCategory";
import { BookSubcategory } from "./BookSubcategory";
import { FileUpload } from "./FileUpload";

export class ElectronicBookLibrary extends AbstractAuditingEntity {
    name: string = 'New eBook';
    description?: string;
    category?: BookCategory | ForeignKeyId;
    subcategory?: BookSubcategory | ForeignKeyId;
    file?: FileUpload;
    author?: string;
    publishDate?: string;
    allowDownloadToExternalUsers: boolean = false;
}