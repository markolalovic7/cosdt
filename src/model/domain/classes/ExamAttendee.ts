import { ExamAttendeeEnum } from '../enums/ExamAttendeeEnum';
import { AbstractAuditingEntity } from './AbstractAuditingEntity';
import { UserProfile } from './UserProfile';
import {Exam} from "./Exam";

export class ExamAttendee extends AbstractAuditingEntity {
    exam!: Exam;
    noOfTries: number = 0;
    examId: number = 0;
    profile!: UserProfile;
    status?: ExamAttendeeEnum;
}
