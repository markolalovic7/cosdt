import { CalendarEventTypeEnum } from "../enums/CalendarEventTypeEnum";

export class CalendarEvent {
    id!: string;
    targetId!: number;
    targetType: CalendarEventTypeEnum = CalendarEventTypeEnum.EVENT;
    eventType?: CalendarEventTypeEnum;
    name?: string;
    description?: string;
    location?: string;
    start?: string;
    end?: string;
    reminder?: string;
    color?: string;
}
