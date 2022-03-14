import { AbstractAuditingEntity } from './AbstractAuditingEntity';
import FormSurvey from './FormSurvey';
import { Organizer } from './Organizer';
import { SeminarCategory } from './SeminarCategory';
import { SeminarReminder } from './SeminarReminder';
import { SeminarSubcategory } from './SeminarSubcategory';

export class Seminar extends AbstractAuditingEntity {
    name: string = '';
    description?: string;
    seminarLocation?: string;
    start?: string;
    end?: string;
    locked: boolean = false;
    intro?: string;
    organisers: Array<Organizer> = [];
    seminarCategory?: SeminarCategory;
    seminarSubCategory?: SeminarSubcategory;
    seminarReminders: Array<SeminarReminder> = [];
    attendedCount: number = 0;
    certifiedCount: number = 0;
    invitedCount: number = 0;
    notInvitedCount: number = 0;
    registeredCount: number = 0;
    survey?: FormSurvey | ForeignKeyId;
}