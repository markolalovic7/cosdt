import { Moment } from 'moment';
import { AbstractAuditingEntity } from './AbstractAuditingEntity';
import { Seminar } from './Seminar';
import { UserProfile } from './UserProfile';

export class SeminarAgenda extends AbstractAuditingEntity {
    name: string = 'New agenda';
    description?: string;
    start?: string;
    end?: string;
    profiles: Array<UserProfile> = [];
    seminar?: Seminar | ForeignKeyId;
    fileId?: number;
    browserFile?:any;
    //Exists only on UI for RangePicker
    range?: Array<Moment> = [];
}
