import Axios from "axios";
import { Organizer } from "../../model/domain/classes/Organizer";
import { Configuration } from "../Configuration";

class OrganizerAPI {
    url: string = `${Configuration.apiUrl}/organisers`;

    getAll(): Promise<Array<Organizer>> {
        return Axios.get(`${this.url}`);
    }

    get(id: number): Promise<Organizer> {
        return Axios.get(`${this.url}/${id}`)
    }
    
    create(resource: Organizer) : Promise<Organizer> {
        return Axios.post(`${this.url}`, resource);
    }

    update(resource: Organizer) : Promise<Organizer> {
        return Axios.put(`${this.url}`, resource)
    }

    delete(id: number) : Promise<void> {
        return Axios.delete(`${this.url}/${id}`);
    }
}

export default OrganizerAPI;