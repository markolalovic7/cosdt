import Axios from "axios";
import { Exam } from "../../model/domain/classes/Exam";
import { ApiParams } from "../../model/ui/types/ApiParams";
import { Configuration } from "../Configuration";

class ExamAPI {
    url: string = `${Configuration.apiUrl}/exams`;

    getAll(params?: ApiParams): Promise<Array<Exam>> {
        return Axios.get(`${this.url}`, { params });
    }

    get(id: number): Promise<Exam> {
        return Axios.get(`${this.url}/${id}`)
    }
    
    create(resource: Exam) : Promise<Exam> {
        return Axios.post(`${this.url}`, resource);
    }

    update(resource: Exam) : Promise<Exam> {
        return Axios.put(`${this.url}`, resource)
    }

    delete(id: number) : Promise<void> {
        return Axios.delete(`${this.url}/${id}`);
    }
}

export default ExamAPI;