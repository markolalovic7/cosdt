import Axios from "axios";
import { ClassAttendeeMentor } from "../../model/domain/classes/ClassAttendeeMentor";
import { ClassAttendeeMentorDiary } from "../../model/domain/classes/ClassAttendeeMentorDiary";
import { ApiParams } from "../../model/ui/types/ApiParams";
import { Configuration } from "../Configuration";

class ClassAttendeeMentorDiaryAPI {
    url: string = `${Configuration.apiUrl}/class-attendees-mentor-lectures`;

    getAll(params?: ApiParams): Promise<Array<ClassAttendeeMentorDiary>> {
        return Axios.get(`${this.url}`, { params });
    }

    get(id: number): Promise<ClassAttendeeMentorDiary> {
        return Axios.get(`${this.url}/${id}`);
    }

    create(resource: ClassAttendeeMentorDiary): Promise<ClassAttendeeMentorDiary> {
        return Axios.post(`${this.url}`, resource);
    }

    update(resource: ClassAttendeeMentorDiary): Promise<ClassAttendeeMentorDiary> {
        return Axios.put(`${this.url}`, resource)
    }

    delete(id: number): Promise<void> {
        return Axios.delete(`${this.url}/${id}`);
    }

    getMentorships(userId: string, locked: boolean = false): Promise<Array<ClassAttendeeMentor>> {
        return Axios.get(`${Configuration.apiUrl}/class-attendees-mentors/byMentor/${userId}?locked=${locked}`)
    }
}

export default ClassAttendeeMentorDiaryAPI;