import Axios from "axios";
import { Configuration } from "../Configuration";
import {DiaryGrades} from "../../model/domain/classes/DiaryGrades";

class ClassGradesAPI {
  url: string = `${Configuration.apiUrl}/class-lectures-diary-grades`;

  getAll( lectureId: number,lecturerId: number): Promise<Array<DiaryGrades>> {
    return Axios.get(`${this.url}/${lectureId}/${lecturerId}`);
  }

  update(lectureId: number, lecturerId:number, resource: DiaryGrades): Promise<DiaryGrades> {
    return Axios.put(`${this.url}/${lectureId}/${lecturerId}`, resource)
  }
  create(lectureId: number,lecturerId: number, resource: DiaryGrades): Promise<DiaryGrades> {
    return Axios.post(`${this.url}/${lectureId}/${lecturerId}`, resource)
  }
  delete(id: number): Promise<DiaryGrades> {
    return Axios.delete(`${this.url}/${id}`)
  }
}

export default ClassGradesAPI;
