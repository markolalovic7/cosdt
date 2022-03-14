import Axios from "axios";
import { FileUpload } from "../../model/domain/classes/FileUpload";
import { Configuration } from "../Configuration";

class DataVaultAPI {
    url: string = `${Configuration.apiUrl}/file-uploads`;

    getAll(pageno:number): Promise<Array<FileUpload>> {
        return Axios.get(`${this.url}?page=${pageno}`);
    }

    get(id: number): Promise<Array<FileUpload>> {
        return Axios.get(`${this.url}/${id}`);
    }

    delete(id: number): Promise<void> {
        return Axios.delete(`${Configuration.apiUrl}/seminar-file/${id}`)
    }

    getFileUrl(file: FileUpload): string {
        return `${Configuration.baseUrl}${file.path}`;
    }
    count(): Promise<number> {
        return Axios.get(`${this.url}/count`);
    }
}

export default DataVaultAPI;
