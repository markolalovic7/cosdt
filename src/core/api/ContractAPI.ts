import Axios from "axios";
import { SeminarFile } from "../../model/domain/classes/SeminarFile";
import { Configuration } from "../Configuration";

class ContractAPI {
    url: string = `${Configuration.apiUrl}/seminar-file`;

    getAll(seminarId: string): Promise<Array<SeminarFile>> {
        return Axios.get(`${this.url}/${seminarId}/contract`);
    }

    create(seminarId: string, data: FormData): Promise<SeminarFile> {
        return Axios.post(`${this.url}/${seminarId}/contract`, data);
    }

    delete(id: number): Promise<void> {
        return Axios.delete(`${this.url}/${id}`)
    }

    getFileUrl(file: SeminarFile): string {
        return `${Configuration.baseUrl}${file.path}`;
    }
}

export default ContractAPI;