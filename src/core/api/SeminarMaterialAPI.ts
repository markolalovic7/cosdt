import Axios from "axios";
import { SeminarFile } from "../../model/domain/classes/SeminarFile";
import { Configuration } from "../Configuration";

class SeminarMaterialAPI {
    url: string = `${Configuration.apiUrl}/seminar-file`;

    getAll(seminarId: string): Promise<Array<SeminarFile>> {
        return Axios.get(`${this.url}/${seminarId}/materials`);
    }

    create(seminarId: string, data: FormData): Promise<SeminarFile> {
        return Axios.post(`${this.url}/${seminarId}/materials`, data);
    }

    delete(id: number): Promise<void> {
        return Axios.delete(`${this.url}/${id}`)
    }

    getFileUrl(file: SeminarFile): string {
        return `${Configuration.baseUrl}/uploads${file.path}`;
    }
}

export default SeminarMaterialAPI;
