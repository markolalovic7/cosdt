import Axios from "axios";
import { ClassLectureFile } from "../../model/domain/classes/ClassLectureFile";
import { Configuration } from "../Configuration";

class ClassLectureMaterialAPI {
    url: string = `${Configuration.apiUrl}/lecture-file`;

    getAll(lectureId: string): Promise<Array<ClassLectureFile>> {
        return Axios.get(`${this.url}/${lectureId}/materials`);
    }

    create(lectureId: string, data: FormData): Promise<ClassLectureFile> {
        return Axios.post(`${this.url}/${lectureId}/materials`, data);
    }

    update(lectureId: string, data: FormData): Promise<ClassLectureFile> {
        return Axios.put(`${this.url}/${lectureId}/materials`, data)
    }

    delete(id: number): Promise<void> {
        return Axios.delete(`${this.url}/${id}`);
    }

    getFileUrl(file: ClassLectureFile): string {
        return `${Configuration.baseUrl}/uploads${file.path}`;
    }
}

export default ClassLectureMaterialAPI;