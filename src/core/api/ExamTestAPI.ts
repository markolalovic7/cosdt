import Axios from "axios";
import { Configuration } from "../Configuration";
import SurveyStart from "../../model/domain/classes/SurveyStart";
import { ExamAttendee } from "../../model/domain/classes/ExamAttendee";
import { SurveyQuestion } from "../../pages/internal-portal/forms-management/survey-builder/SurveyBuilder";

class ExamTestAPI {
  url: string = `${Configuration.apiUrl}/take-exam`;

  get(id: number): Promise<SurveyStart> {
    return Axios.get(`${this.url}/${id}/start`)
  }
  getAcceptInvitation(id: number, attendeeId: number): Promise<void> {
    return Axios.get(`${this.url}/${id}/accept/${attendeeId}`)
  }
  applyForExam(id: number): Promise<ExamAttendee> {
    return Axios.get(`${this.url}/${id}/applyForExam`)
  }
  invite(examId: number, profiles: Array<number>): Promise<void> {
    return Axios.post(`${this.url}/${examId}/invite`, {
      examId,
      profiles,
    });
  }
  submit(examId: number, questions: Array<SurveyQuestion>): Promise<void> {
    return Axios.put(`${this.url}/${examId}/submit`, questions);
  }
  getEvaluationReport(examId: number): Promise<Blob> {
    return Axios.get(`${this.url}/report/${examId}`, {
      headers: {
        ContentType: "application/xlsx",
      },
      responseType: 'blob'
    });
  }
  getExamReportByUser(examId:number, profileId: number): Promise<Blob> {
    return Axios.get(`${this.url}/report/${examId}/${profileId}`, {
      headers: {
        ContentType: "application/xlsx",
      },
      responseType: 'blob'
    });
  }
}
export default ExamTestAPI
