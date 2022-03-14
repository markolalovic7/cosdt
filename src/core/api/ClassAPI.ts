import Axios from "axios";
import { Class } from "../../model/domain/classes/Class";
import { Configuration } from "../Configuration";

class ClassAPI {
  url: string = `${Configuration.apiUrl}/class`;

  getAll(): Promise<Array<Class>> {
    return Axios.get(`${this.url}`);
  }
  get(id: number): Promise<Class> {
    return Axios.get(`${this.url}/${id}`)
  }
  create(resource: Class) : Promise<Class> {
    return Axios.post(`${this.url}`, resource);
  }
  update(resource: Class) : Promise<Class> {
    return Axios.put(`${this.url}`, resource);
  }
  delete(id: number) : Promise<void> {
    return Axios.delete(`${this.url}/${id}`);
  }
}
export default ClassAPI;
