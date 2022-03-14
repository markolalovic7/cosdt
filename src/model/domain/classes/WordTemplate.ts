import {FileUpload} from "./FileUpload";
import {Seminar} from "./Seminar";
import {UserProfile} from "./UserProfile";

export class WordTemplate extends FileUpload {
  name: string = "New Template";
  profile?: UserProfile;
  seminar?: Seminar;
}
