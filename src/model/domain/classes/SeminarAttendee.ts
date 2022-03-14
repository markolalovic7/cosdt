import { SeminarAttendeeStatusEnum } from '../enums/SeminarAttendeeStatusEnum';
import { SeminarEvaluationStatusEnum } from '../enums/SeminarEvaluationStatusEnum';
import { AbstractAuditingEntity } from './AbstractAuditingEntity';
import { Seminar } from './Seminar';
import { UserProfile } from './UserProfile';

export class SeminarAttendee extends AbstractAuditingEntity {
    status: SeminarAttendeeStatusEnum = SeminarAttendeeStatusEnum.NOT_INVITED;
    evaluationStatus: SeminarEvaluationStatusEnum = SeminarEvaluationStatusEnum.PENDING;
    evaluationStart?: string;
    evaluationFinish?: string;
    profile!: UserProfile;
    seminar?: Seminar | ForeignKeyId;
    // userFunction?: string;
    // userInstitution?: string;
}
