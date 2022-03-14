import Axios from "axios";
import { Configuration } from "../Configuration";

class ClassDiaryExportAPI {
  url: string = `${Configuration.apiUrl}/class-diary/export/`;

  practical(seminarId: string): Promise<ArrayBuffer> {
    return Axios.get(`${this.url}prakticni-dio/${seminarId}`, {
      headers: {
        ContentType: "application/zip",
      },
      responseType: 'blob'
    });
  }
  theory(id:number): Promise<ArrayBuffer> {
    return Axios.get(`${this.url}teorijski-dio/${id}`, {
      headers: {
        ContentType: "application/zip",
      },
      responseType: 'blob'
    });
  }
}

export default ClassDiaryExportAPI;
