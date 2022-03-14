import Axios from "axios";
import { SeminarAgenda } from "../../model/domain/classes/SeminarAgenda";
import { SeminarLecturer } from "../../model/domain/classes/SeminarLecturer";
import { ApiParams } from "../../model/ui/types/ApiParams";
import { Configuration } from "../Configuration";

class SeminarAgendaAPI {
    url: string = `${Configuration.apiUrl}/seminar-agenda`;
    lecturerUrl: string = `${Configuration.apiUrl}/seminar-lecturers`;

    getAll(params?: ApiParams): Promise<Array<SeminarAgenda>> {
        return Axios.get(`${this.url}`, { params });
    }

    get(id: number): Promise<SeminarAgenda> {
        return Axios.get(`${this.url}/${id}`)
    }

    create(resource: SeminarAgenda) : Promise<SeminarAgenda> {
        return Axios.post(`${this.url}`, resource);
    }

    update(resource: SeminarAgenda) : Promise<SeminarAgenda> {
        return Axios.put(`${this.url}`, resource)
    }

    delete(id: number) : Promise<void> {
        return Axios.delete(`${this.url}/${id}`);
    }

    getLecturers(seminarId: string): Promise<Array<SeminarLecturer>> {
        return Axios.get(`${this.url}/${seminarId}/lecturers`)
    }

    downloadLecturersCertificates( seminarId: Array<number>, profiles: Array<number>): Promise<ArrayBuffer> {
        return Axios.post(`${this.lecturerUrl}/action/downloadCertificates`, {
            profiles,
            seminarId
        }, {
            headers: {
                ContentType: "application/zip",
            },
            responseType: 'blob'
        });
    }
    getDocx(seminarId: number): Promise<Blob> {
        return Axios.get(`${this.url}/${seminarId}/docx`, {
            headers: {
                ContentType: "application/pdf",
            },
            responseType: 'blob'
        });
    }

    getPdf(seminarId: number): Promise<Blob> {
        return Axios.get(`${this.url}/${seminarId}/pdf`, {
            headers: {
                ContentType: "application/pdf",
            },
            responseType: 'blob'
        });
    }
}

export default SeminarAgendaAPI;
