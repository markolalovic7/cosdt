import {Configuration} from "../Configuration";
import Axios from "axios";
import FormSurvey from "../../model/domain/classes/FormSurvey";


class SeminarSurveyAPI {
    url: string = `${Configuration.apiUrl}/seminar-survey/surveys`;

    getAll(): Promise<Array<FormSurvey>> {
        return Axios.get(`${this.url}`);
    }
    get(id: number): Promise<FormSurvey> {
        return Axios.get(`${this.url}/${id}`);
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
}

export default SeminarSurveyAPI;
