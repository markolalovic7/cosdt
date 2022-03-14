import Axios from "axios";
import { SampleClass } from "../../model/domain/classes/SampleClass";
import { ApiParams } from "../../model/ui/types/ApiParams";
import { Configuration } from "../Configuration";

class SampleAPI {
    url: string = `${Configuration.apiUrl}/institutions`;

    getAll(params?: ApiParams): Promise<Array<SampleClass>> {
        return Axios.get(`${this.url}`, { params });
    }

    count(params: ApiParams): Promise<number> {
        return Axios.get(`${this.url}/count`, { params });
    }

    get(id: number): Promise<SampleClass> {
        return Axios.get(`${this.url}/${id}`)
    }
    
    create(resource: SampleClass) : Promise<SampleClass> {
        return Axios.post(`${this.url}`, resource);
    }

    update(resource: SampleClass) : Promise<SampleClass> {
        return Axios.put(`${this.url}`, resource)
    }

    delete(id: number) : Promise<void> {
        return Axios.delete(`${this.url}/${id}`);
    }
}

export default SampleAPI;