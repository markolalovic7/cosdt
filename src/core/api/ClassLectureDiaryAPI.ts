import Axios from "axios";
import { Configuration } from "../Configuration";
import {TheoryDiary} from "../../model/domain/classes/TheoryDiary";

class ClassLectureDiaryAPI {
    url: string = `${Configuration.apiUrl}/class-lectures-diary`;

    getAll(lectureId: number): Promise<Array<TheoryDiary>> {
        return Axios.get(`${this.url}/${lectureId}`);
    }

    update(lectureId: number, resource: Array<TheoryDiary>): Promise<Array<TheoryDiary>> {
        return Axios.put(`${this.url}/${lectureId}`, resource)
    }
}

export default ClassLectureDiaryAPI;
