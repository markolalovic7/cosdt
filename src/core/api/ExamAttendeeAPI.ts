import Axios from "axios";
import { ExamAttendee } from "../../model/domain/classes/ExamAttendee";
import { ApiParams } from "../../model/ui/types/ApiParams";
import { Configuration } from "../Configuration";
import {Exam} from "../../model/domain/classes/Exam";

class ExamAttendeeAPI {
    url: string = `${Configuration.apiUrl}/exam-attendees`;

    getAll(params?: ApiParams): Promise<Array<ExamAttendee>> {
        return Axios.get(`${this.url}`, { params });
    }

    get(id: number): Promise<ExamAttendee> {
        return Axios.get(`${this.url}/${id}`)
    }
    getExamsByAttendee(id: number): Promise<Array<ExamAttendee>> {
        return Axios.get(`${this.url}/${id}/exams`)
    }
    getOtherExams(id: number): Promise<Array<Exam>> {
        return Axios.get(`${this.url}/${id}/other-exams`)
    }
    create(resource: ExamAttendee): Promise<ExamAttendee> {
        return Axios.post(`${this.url}`, resource);
    }

    createMultiple(resources: Array<ExamAttendee>): Promise<Array<ExamAttendee>> {
        return Axios.post(`${this.url}-create-multiple`, resources);
    }

    update(resource: ExamAttendee): Promise<ExamAttendee> {
        return Axios.put(`${this.url}`, resource)
    }

    delete(id: number): Promise<void> {
        return Axios.delete(`${this.url}/${id}`);
    }
}

export default ExamAttendeeAPI;
