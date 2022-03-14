import Axios from "axios";
import { CostCategory } from "../../model/domain/classes/CostCategory";
import { Configuration } from "../Configuration";

class CostCategoryAPI {
    url: string = `${Configuration.apiUrl}/cost-categories`;

    getAll(): Promise<Array<CostCategory>> {
        return Axios.get(`${this.url}`);
    }

    get(id: number): Promise<CostCategory> {
        return Axios.get(`${this.url}/${id}`);
    }

    create(resource: CostCategory) : Promise<CostCategory> {
        return Axios.post(`${this.url}`, resource);
    }

    update(resource: CostCategory) : Promise<CostCategory> {
        return Axios.put(`${this.url}`, resource)
    }

    delete(id: number) : Promise<void> {
        return Axios.delete(`${this.url}/${id}`);
    }
}

export default CostCategoryAPI;