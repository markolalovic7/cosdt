import Axios from "axios";
import { SeminarSubcategory } from "../../model/domain/classes/SeminarSubcategory";
import { Configuration } from "../Configuration";

class SeminarSubcategoryAPI {
    url: string = `${Configuration.apiUrl}/seminar-sub-categories`;

    getAll(): Promise<Array<SeminarSubcategory>> {
        return Axios.get(`${this.url}`);
    }

    getAllbyParentId(id: number): Promise<Array<SeminarSubcategory>> {
        return Axios.get(`${this.url}`, {params: {
            [`parentCategoryId.equals`]: id
        }});
    }

    get(id: number): Promise<SeminarSubcategory> {
        return Axios.get(`${this.url}/${id}`);
    }

    create(resource: SeminarSubcategory) : Promise<SeminarSubcategory> {
        return Axios.post(`${this.url}`, resource);
    }

    update(resource: SeminarSubcategory) : Promise<SeminarSubcategory> {
        return Axios.put(`${this.url}`, resource)
    }

    delete(id: number) : Promise<void> {
        return Axios.delete(`${this.url}/${id}`);
    }
}

export default SeminarSubcategoryAPI;