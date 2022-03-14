import { AbstractAuditingEntity } from "./AbstractAuditingEntity";
import { UserProfile } from "./UserProfile";
import {ClassAttendee} from "./ClassAttendee";

export class Mentor extends AbstractAuditingEntity {
  mentor!: UserProfile;
  atendee?: ClassAttendee;
  evaluationDescription?: string;
  evaluationSummary?: string;
  odlukaOIzboruKandidataBr?:	string;
  odlukaOIzboruKandidataDatum?:	string;
  odlukaOOdredjivanjuBr?:	string;
  odlukaOOdredjivanjuDatum?:	string;
  odlukaOOdredjivanjuMentoraBr?:	string;
  odlukaOOdredjivanjuMentoraDatum?:	string;
  start?:	string;
  jsonString: string = "";
}
