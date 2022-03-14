import { OriginEnum } from '../enums/OriginEnum';
import { AbstractAuditingEntity } from './AbstractAuditingEntity';

export class Organizer extends AbstractAuditingEntity {
    name: string = 'New organizator';
    description?: string;
    origin?: OriginEnum;
    coorganiser: boolean = false;
}