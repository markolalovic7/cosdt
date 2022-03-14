
import { AbstractAuditingEntity } from './AbstractAuditingEntity';
import { UserProfile } from './UserProfile';
import { ClassAttendeeStatusEnum } from '../enums/ClassAttendeeStatusEnum';
import {Mentor} from "./Mentor";
import {Class} from "./Class";

export class ClassAttendee extends AbstractAuditingEntity {
  jsonData: string = "";
  klass?: Class;
  profile!: UserProfile;
  status: string = ClassAttendeeStatusEnum.INITIAL_CANDIDATE;
   mentors: Mentor[] = [];
  brojIdatumOdlukeOizboru?:	string;
  brojIdatumOdlukeSavjeta?:	string;
}
