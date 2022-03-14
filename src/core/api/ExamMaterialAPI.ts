import Axios from "axios";
import { Configuration } from "../Configuration";
import { ExamFile } from "../../model/domain/classes/ExamFile";

class ExamMaterialAPI {
  url: string = `${Configuration.apiUrl}/exam-file`;

  getAll(examId: string): Promise<Array<ExamFile>> {
    return Axios.get(`${this.url}/${examId}/materials`);
  }

  create(examId: string, data: FormData): Promise<ExamFile> {
    return Axios.post(`${this.url}/${examId}/materials`, data);
  }
  /*
    delete(id: number): Promise<void> {
      return Axios.delete(`${this.url}/${id}`)
    }
  
    getFileUrl(file: SeminarFile): string {
      return `${Configuration.baseUrl}${file.path}`;
    }*/
}

export default ExamMaterialAPI;
