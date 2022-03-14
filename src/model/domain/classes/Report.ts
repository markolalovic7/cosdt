import { FileUpload } from "./FileUpload";
import { Seminar } from "./Seminar";
import { UserProfile } from "./UserProfile";

export class Report extends FileUpload {
    profile?: UserProfile;
    seminar?: Seminar;
}