import Axios from "axios";
import { ApiParams } from "../../model/ui/types/ApiParams";
import { Configuration } from "../Configuration";
import { ClassAttendee } from "../../model/domain/classes/ClassAttendee";


class ClassAttendeeAPI {
  url: string = `${Configuration.apiUrl}/class-attendees`;

  getAll(params?: ApiParams): Promise<Array<ClassAttendee>> {
    return Axios.get(`${this.url}`, { params });
  }

  get(id: number): Promise<ClassAttendee> {
    return Axios.get(`${this.url}/${id}`)
  }

  create(resource: ClassAttendee): Promise<ClassAttendee> {
    return Axios.post(`${this.url}`, resource);
  }

  createMultiple(resources: Array<ClassAttendee>): Promise<Array<ClassAttendee>> {
    return Axios.post(`${this.url}-create-multiple`, resources);
  }

  update(resource: ClassAttendee): Promise<ClassAttendee> {
    return Axios.put(`${this.url}`, resource)
  }

  delete(id: number): Promise<void> {
    return Axios.delete(`${this.url}/${id}`);
  }
}
export default ClassAttendeeAPI;
