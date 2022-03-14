import Axios from "axios";
import { Seminar } from "../../model/domain/classes/Seminar";
import { ApiParams } from "../../model/ui/types/ApiParams";
import { Configuration } from "../Configuration";

class SeminarAPI {
    url: string = `${Configuration.apiUrl}/seminars`;
    templateUrl: string = `${Configuration.apiUrl}/invitation/seminars/template-options`;
    searchUrl: string = `${Configuration.apiUrl}/seminars-by-attendes`;

    getAll(params?: ApiParams): Promise<Array<Seminar>> {
        return Axios.get(`${this.url}`, { params });
    }

    count(params: ApiParams): Promise<number> {
        return Axios.get(`${this.url}/count`, { params });
    }

    get(id: number): Promise<Seminar> {
        return Axios.get(`${this.url}/${id}`)
    }
    search(params?:string): Promise<Array<Seminar>> {
        return Axios.get(`${this.searchUrl}?${params}`)
    }

    create(resource: Seminar) : Promise<Seminar> {
        return Axios.post(`${this.url}`, resource);
    }

    update(resource: Seminar) : Promise<Seminar> {
        return Axios.put(`${this.url}`, resource)
    }

    lock(id: number) : Promise<Seminar> {
        return Axios.put(`${this.url}/${id}/lock`);
    }

    delete(id: number) : Promise<void> {
        return Axios.delete(`${this.url}/${id}`);
    }
    duplicate(seminarId: number) : Promise<Seminar> {
        return Axios.put(`${this.url}/${seminarId}/duplicate`)
    }
    getTemplateOptions(): Promise<Array<string>> {
        return Axios.get(`${this.templateUrl}`);
    }
    downloadList(seminarIds:Array<number> ): Promise<Blob> {
        return Axios.post(`${Configuration.apiUrl}/seminar/action/downloadDescriptionInfoList`, {
            seminarIds
        }, {responseType: "blob"});
    }

}

export default SeminarAPI;
