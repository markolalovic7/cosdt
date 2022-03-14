import Axios from "axios";
import { CalendarEvent } from "../../model/domain/classes/CalendarEvent";
import { Event } from "../../model/domain/classes/Event";
import { ApiParams } from "../../model/ui/types/ApiParams";
import { Configuration } from "../Configuration";

class EventAPI {
    url: string = `${Configuration.apiUrl}/events`;
    calendarUrl: string = `${Configuration.apiUrl}/calendar`;

    getAllCalendarEvents(from: string, to: string): Promise<Array<CalendarEvent>> {
        return Axios.get(`${this.calendarUrl}`, {
            params: {
                from,
                to
            }
        });
    }

    getAll(params: ApiParams): Promise<Array<CalendarEvent>> {
        return Axios.get(`${this.url}`, { params });
    }

    get(id: number): Promise<Event> {
        return Axios.get(`${this.url}/${id}`);
    }

    create(resource: Event): Promise<CalendarEvent> {
        return Axios.post(`${this.url}`, resource);
    }

    update(resource: Event): Promise<CalendarEvent> {
        return Axios.put(`${this.url}`, resource)
    }

    delete(id: number): Promise<void> {
        return Axios.delete(`${this.url}/${id}`);
    }
}

export default EventAPI;
