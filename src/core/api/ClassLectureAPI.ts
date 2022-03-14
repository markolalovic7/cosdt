import Axios from "axios";
import { ApiParams } from "../../model/ui/types/ApiParams";
import { Configuration } from "../Configuration";
import { ClassLecture } from "../../model/domain/classes/ClassLecture";


class ClassLectureAPI {
  url: string = `${Configuration.apiUrl}/class-lectures`;

  getAll(params?: ApiParams): Promise<Array<ClassLecture>> {
    return Axios.get(`${this.url}`, { params });
  }

  get(id: number): Promise<ClassLecture> {
    return Axios.get(`${this.url}/${id}`)
  }

  create(resource: ClassLecture): Promise<ClassLecture> {
    return Axios.post(`${this.url}`, resource);
  }

  //   createMultiple(resources: Array<ClassLecture>): Promise<Array<ClassLecture>> {
  //     return Axios.post(`${this.url}-create-multiple`, resources);
  //   }

  update(resource: ClassLecture): Promise<ClassLecture> {
    return Axios.put(`${this.url}`, resource)
  }

  delete(id: number): Promise<void> {
    return Axios.delete(`${this.url}/${id}`);
  }

  downloadLecturersCertificates( classLectureIds: Array<number>, profiles: Array<number>): Promise<ArrayBuffer> {
    return Axios.post(`${this.url}/action/downloadCertificates`, {
      classLectureIds,
      profiles
    }, {
      headers: {
        ContentType: "application/zip",
      },
      responseType: 'blob'
    });
  }
}
export default ClassLectureAPI;
///api/class-lectures/action/downloadCertificates