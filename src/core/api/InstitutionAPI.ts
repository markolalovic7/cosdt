import Axios from "axios";
import { Institution } from "../../model/domain/classes/Institution";
import { Configuration } from "../Configuration";

class InstitutionAPI {
    url: string = `${Configuration.apiUrl}/institutions`;

    getAll(): Promise<Array<Institution>> {
        return Axios.get(`${this.url}`);
    }

    get(id: number): Promise<Institution> {
        return Axios.get(`${this.url}/${id}`);
    }

    create(resource: Institution) : Promise<Institution> {
        return Axios.post(`${this.url}`, resource);
    }

    update(resource: Institution) : Promise<Institution> {
        return Axios.put(`${this.url}`, resource)
    }

    delete(id: number) : Promise<void> {
        return Axios.delete(`${this.url}/${id}`);
    }
}

export default InstitutionAPI;