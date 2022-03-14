import Axios from "axios";
import { Location } from "../../model/domain/classes/Location";
import { Configuration } from "../Configuration";

class LocationAPI {
    url: string = `${Configuration.apiUrl}/location`;

    getAll(): Promise<Array<Location>> {
        return Axios.get(`${this.url}`);
    }

    get(id: number): Promise<Location> {
        return Axios.get(`${this.url}/${id}`)
    }
    
    create(resource: Location) : Promise<Location> {
        return Axios.post(`${this.url}`, resource);
    }

    update(resource: Location) : Promise<Location> {
        return Axios.put(`${this.url}`, resource)
    }

    delete(id: number) : Promise<void> {
        return Axios.delete(`${this.url}/${id}`);
    }
}

export default LocationAPI;