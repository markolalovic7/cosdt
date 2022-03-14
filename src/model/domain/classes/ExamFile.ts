import { FileUpload } from "./FileUpload";
import { Exam } from "./Exam";
import { UserProfile } from "./UserProfile";

export class ExamFile extends FileUpload {
  seminar?: Exam | ForeignKeyId;
  profile?: UserProfile | ForeignKeyId;
}
