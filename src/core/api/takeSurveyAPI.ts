import Axios from "axios";
import {Configuration} from "../Configuration";
import FormSurvey from "../../model/domain/classes/FormSurvey";

class TakeSurveyAPI {
  url: string = `${Configuration.apiUrl}/take-survey/`;

  getEvaluationReport(seminarId: number): Promise<Blob> {
    return Axios.get(`${this.url}report/${seminarId}`, {
      headers: {
        ContentType: "application/xlsx",
      },
      responseType: 'blob'
    });
  }
  takeSurvey(seminarId: number, profileId: number): Promise<FormSurvey> {
   return Axios.get( `${this.url}${profileId}/${seminarId}/start`)
  }
  submitSurvey(seminarId: number, profileId: number, value: any): Promise<FormSurvey> {
    return Axios.put( `${this.url}${profileId}/${seminarId}/submit`, value)
  }
}

export default TakeSurveyAPI;
