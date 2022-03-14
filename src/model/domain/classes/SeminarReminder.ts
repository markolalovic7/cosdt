import { AbstractAuditingEntity } from './AbstractAuditingEntity';

export class SeminarReminder extends AbstractAuditingEntity {
    emailNotification: boolean = true;
    pushNotification: boolean = true;
    smsNotification: boolean = true;
    start?: string;
    reminderAt?: string;
    secondsBeforeStart?: number;
    secondsBefore?: number|null;
}
