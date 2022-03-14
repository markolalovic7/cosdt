import Axios from "axios";
import { ExamSubcategory } from "../../model/domain/classes/ExamSubcategory";
import { Configuration } from "../Configuration";

class ExamSubcategoryAPI {
    url: string = `${Configuration.apiUrl}/exam-sub-categories`;

    getAll(): Promise<Array<ExamSubcategory>> {
        return Axios.get(`${this.url}`);
    }

    getAllbyParentId(id: number): Promise<Array<ExamSubcategory>> {
        return Axios.get(`${this.url}`, {
            params: {
                [`parentCategoryId.equals`]: id
            }
        });
    }

    get(id: number): Promise<ExamSubcategory> {
        return Axios.get(`${this.url}/${id}`);
    }

    create(resource: ExamSubcategory): Promise<ExamSubcategory> {
        return Axios.post(`${this.url}`, resource);
    }

    update(resource: ExamSubcategory): Promise<ExamSubcategory> {
        return Axios.put(`${this.url}`, resource)
    }

    delete(id: number): Promise<void> {
        return Axios.delete(`${this.url}/${id}`);
    }
}

export default ExamSubcategoryAPI;