import { Moment } from "moment";
import { AbstractAuditingEntity } from "./AbstractAuditingEntity";
import { SeminarReminder } from "./SeminarReminder";
import { UserProfile } from "./UserProfile";
import {CalendarEventTypeEnum} from "../enums/CalendarEventTypeEnum";
import {Location} from "./Location";

export class Event extends AbstractAuditingEntity {
    name: string = "";
    description?: string;
    location?: string = "0";
    start?: string;
    end?: string;
    eventType: CalendarEventTypeEnum = CalendarEventTypeEnum.INTERNAL_MEETING;
    seminarLocation:Location = new Location();
    attendees: Array<UserProfile> = [];
    reminder?: SeminarReminder[];

    //Exists only on UI for RangePicker
    range: Array<Moment> = [];
}
