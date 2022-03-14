import { Moment } from 'moment';
import { AbstractAuditingEntity } from './AbstractAuditingEntity';

export class ClassLectureInstance extends AbstractAuditingEntity {
  location?: string;
  description?: string;
  start?: string;
  end?: string;
  range: Array<Moment | undefined> = [];
}
