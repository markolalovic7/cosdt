import Axios from "axios";
import { SeminarCost } from "../../model/domain/classes/SeminarCost";
import { FileUpload } from "../../model/domain/classes/FileUpload";
import { Configuration } from "../Configuration";
import { ApiParams } from "../../model/ui/types/ApiParams";

class SeminarCostAPI {
    url: string = `${Configuration.apiUrl}/seminar-costs`;

    getAll(params: ApiParams): Promise<Array<SeminarCost>> {
        return Axios.get(`${this.url}`, {params});
    }

    get(id: number): Promise<SeminarCost> {
        return Axios.get(`${this.url}/${id}`);
    }

    create(resource: SeminarCost) : Promise<SeminarCost> {
        return Axios.post(`${this.url}`, resource);
    }

    update(resource: SeminarCost) : Promise<SeminarCost> {
        return Axios.put(`${this.url}`, resource)
    }

    delete(id: number) : Promise<void> {
        return Axios.delete(`${this.url}/${id}`);
    }

    download(seminarId: number): string {
        return `${this.url}/xlsx/${seminarId}`;
    }

    uploadFile(id: ObjectId, data: FormData): Promise<SeminarCost> {
        return Axios.post(`${this.url}/${id}`, data);
    }

    getFileUrl(file: FileUpload): string {
        return `${Configuration.baseUrl}${file.path}`;
    }
    getReport(seminarIds: Array<number>) : Promise<File> {
        return Axios.post(`${this.url}/all/xlsx`, {seminarIds : seminarIds},
          {
              headers: {
                  ContentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              },
              responseType: 'arraybuffer'
          }
          );
    }
 }

export default SeminarCostAPI;
