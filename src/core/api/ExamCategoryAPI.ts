import Axios from "axios";
import { ExamCategory } from "../../model/domain/classes/ExamCategory";
import { Configuration } from "../Configuration";

class ExamCategoryAPI {
    url: string = `${Configuration.apiUrl}/exam-categories`;

    getAll(): Promise<Array<ExamCategory>> {
        return Axios.get(`${this.url}`);
    }

    get(id: number): Promise<ExamCategory> {
        return Axios.get(`${this.url}/${id}`);
    }

    create(resource: ExamCategory): Promise<ExamCategory> {
        return Axios.post(`${this.url}`, resource);
    }

    update(resource: ExamCategory): Promise<ExamCategory> {
        return Axios.put(`${this.url}`, resource)
    }

    delete(id: number): Promise<void> {
        return Axios.delete(`${this.url}/${id}`);
    }
}

export default ExamCategoryAPI;