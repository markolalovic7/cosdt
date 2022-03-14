import Axios from "axios";
import { SeminarCategory } from "../../model/domain/classes/SeminarCategory";
import { Configuration } from "../Configuration";

class SeminarCategoryAPI {
    url: string = `${Configuration.apiUrl}/seminar-categories`;

    getAll(): Promise<Array<SeminarCategory>> {
        return Axios.get(`${this.url}`);
    }

    get(id: number): Promise<SeminarCategory> {
        return Axios.get(`${this.url}/${id}`);
    }

    create(resource: SeminarCategory) : Promise<SeminarCategory> {
        return Axios.post(`${this.url}`, resource);
    }

    update(resource: SeminarCategory) : Promise<SeminarCategory> {
        return Axios.put(`${this.url}`, resource)
    }

    delete(id: number) : Promise<void> {
        return Axios.delete(`${this.url}/${id}`);
    }
}

export default SeminarCategoryAPI;