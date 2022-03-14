import {Configuration} from "../Configuration";
import Axios from "axios";
import FormSurvey from "../../model/domain/classes/FormSurvey";


class SurveyAPI {
    url: string = `${Configuration.apiUrl}/surveys`;

    getAll(): Promise<Array<FormSurvey>> {
        return Axios.get(`${this.url}`);
    }
    get(id: number): Promise<FormSurvey> {
        return Axios.get(`${this.url}/${id}`);
    }
    getSurvey(id: number): Promise<any> {
        return Axios.get(`${Configuration.apiUrl}/as/${id}`);
    }
    submit(id: number, data:any): Promise<FormSurvey> {
        return Axios.post(`${Configuration.apiUrl}/as/${id}`, data);
    }
    create(resource: FormSurvey) : Promise<FormSurvey> {
        return Axios.post(`${this.url}`, resource);
    }
    update(resource: FormSurvey) : Promise<FormSurvey> {
        return Axios.put(`${this.url}`, resource)
    }
    delete(id: number) : Promise<void> {
        return Axios.delete(`${this.url}/${id}`);
    }
    getEvaluationReport(seminarId: number): Promise<Blob> {
        return Axios.get(`${this.url}/api/take-survey/report/${seminarId}`, {
            headers: {
                ContentType: "application/xlsx",
            },
            responseType: 'blob'
        });
    }
}

export default SurveyAPI;
