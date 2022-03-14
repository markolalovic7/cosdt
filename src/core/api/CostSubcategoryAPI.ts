import Axios from "axios";
import { CostSubcategory } from "../../model/domain/classes/CostSubcategory";
import { Configuration } from "../Configuration";

class CostSubcategoryAPI {
    url: string = `${Configuration.apiUrl}/cost-sub-categories`;

    getAll(): Promise<Array<CostSubcategory>> {
        return Axios.get(`${this.url}`);
    }

    getAllbyParentId(id: number): Promise<Array<CostSubcategory>> {
        return Axios.get(`${this.url}?parentCategoryId.equals=${id}`, );
    }

    get(id: number): Promise<CostSubcategory> {
        return Axios.get(`${this.url}/${id}`);
    }

    create(resource: CostSubcategory) : Promise<CostSubcategory> {
        return Axios.post(`${this.url}`, resource);
    }

    update(resource: CostSubcategory) : Promise<CostSubcategory> {
        return Axios.put(`${this.url}`, resource)
    }

    delete(id: number) : Promise<void> {
        return Axios.delete(`${this.url}/${id}`);
    }
}

export default CostSubcategoryAPI;
