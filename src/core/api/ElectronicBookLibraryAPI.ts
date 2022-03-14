import Axios from "axios";
import { ElectronicBookLibrary } from "../../model/domain/classes/ElectronicBookLibrary";
import { FileUpload } from "../../model/domain/classes/FileUpload";
import { Configuration } from "../Configuration";

class ElectronicBookLibraryAPI {
    url: string = `${Configuration.apiUrl}/e-books`;

    getAll(): Promise<Array<ElectronicBookLibrary>> {
        return Axios.get(`${this.url}`);
    }

    get(id: number): Promise<ElectronicBookLibrary> {
        return Axios.get(`${this.url}/${id}`);
    }

    create(resource: ElectronicBookLibrary) : Promise<ElectronicBookLibrary> {
        return Axios.post(`${this.url}`, resource);
    }

    update(resource: ElectronicBookLibrary) : Promise<ElectronicBookLibrary> {
        return Axios.put(`${this.url}`, resource)
    }

    delete(id: number) : Promise<void> {
        return Axios.delete(`${this.url}/${id}`);
    }

    uploadFile(id: ObjectId, data: FormData): Promise<ElectronicBookLibrary> {
        return Axios.post(`${this.url}/upload/${id}`, data);
    }

    getFileUrl(file: FileUpload): string {
        return `${Configuration.baseUrl}/uploads${file.path}`;
    }
 }

export default ElectronicBookLibraryAPI;
