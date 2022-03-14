import Axios from "axios";
import { Configuration } from "../Configuration";
import { Mentor } from "../../model/domain/classes/Mentor";

class ClassAttendeeMentorAPI {
  url: string = `${Configuration.apiUrl}/class-attendees-mentors`;

  getAll(): Promise<Array<Mentor>> {
    return Axios.get(`${this.url}`);
  }

  get(id: number): Promise<Mentor> {
    return Axios.get(`${this.url}/${id}`)
  }

  create(resource: Mentor): Promise<Mentor> {
    return Axios.post(`${this.url}`, resource);
  }

  update(resource: Mentor): Promise<Mentor> {
    return Axios.put(`${this.url}`, resource)
  }

  delete(id: number): Promise<void> {
    return Axios.delete(`${this.url}/${id}`);
  }
}

export default ClassAttendeeMentorAPI;
