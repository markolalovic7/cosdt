import Axios from "axios";
import { ClassLectureInstance } from "../../model/domain/classes/ClassLectureInstance";
import { ApiParams } from "../../model/ui/types/ApiParams";
import { Configuration } from "../Configuration";


class ClassLectureInstanceAPI {
  url: string = `${Configuration.apiUrl}/class-lecture-instances`;

  getAll(params?: ApiParams): Promise<Array<ClassLectureInstance>> {
    return Axios.get(`${this.url}`, { params });
  }

  get(id: number): Promise<ClassLectureInstance> {
    return Axios.get(`${this.url}/${id}`)
  }

  create(resource: ClassLectureInstance): Promise<ClassLectureInstance> {
    return Axios.post(`${this.url}`, resource);
  }

  //   createMultiple(resources: Array<ClassLectureInstance>): Promise<Array<ClassLectureInstance>> {
  //     return Axios.post(`${this.url}-create-multiple`, resources);
  //   }

  update(resource: ClassLectureInstance): Promise<ClassLectureInstance> {
    return Axios.put(`${this.url}`, resource)
  }

  delete(id: number): Promise<void> {
    return Axios.delete(`${this.url}/${id}`);
  }
}
export default ClassLectureInstanceAPI;
