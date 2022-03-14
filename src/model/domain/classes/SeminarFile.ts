import { FileUpload } from "./FileUpload";
import { Seminar } from "./Seminar";
import { UserProfile } from "./UserProfile";

export class SeminarFile extends FileUpload {
    seminar?: Seminar | ForeignKeyId;
    profile?: UserProfile | ForeignKeyId;
}