import Axios from "axios";
import { ApiParams } from "../../model/ui/types/ApiParams";
import { Configuration } from "../Configuration";
import { ClassModule } from "../../model/domain/classes/ClassModule";


class ClassModuleAPI {
  url: string = `${Configuration.apiUrl}/class-modules`;

  getAll(params?: ApiParams): Promise<Array<ClassModule>> {
    return Axios.get(`${this.url}`, { params });
  }

  get(id: number): Promise<ClassModule> {
    return Axios.get(`${this.url}/${id}`)
  }

  create(resource: ClassModule): Promise<ClassModule> {
    return Axios.post(`${this.url}`, resource);
  }

  update(resource: ClassModule): Promise<ClassModule> {
    return Axios.put(`${this.url}`, resource)
  }

  delete(id: number): Promise<void> {
    return Axios.delete(`${this.url}/${id}`);
  }
}
export default ClassModuleAPI;
