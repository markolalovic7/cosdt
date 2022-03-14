import Axios from "axios";
import { SeminarAttendee } from "../../model/domain/classes/SeminarAttendee";
import { ApiParams } from "../../model/ui/types/ApiParams";
import { Configuration } from "../Configuration";
import {SeminarAttendeeStatusEnum} from "../../model/domain/enums/SeminarAttendeeStatusEnum";

class SeminarAttendeeAPI {
    url: string = `${Configuration.apiUrl}/seminar-attendees`;
    urlLecturers: string = `${Configuration.apiUrl}/seminar-lecturers`;
    getAll(params?: ApiParams): Promise<Array<SeminarAttendee>> {
        return Axios.get(`${this.url}`, { params });
    }

    get(id: number): Promise<SeminarAttendee> {
        return Axios.get(`${this.url}/${id}`)
    }

    create(resource: SeminarAttendee): Promise<SeminarAttendee> {
        return Axios.post(`${this.url}`, resource);
    }

    createMultiple(resources: Array<SeminarAttendee>): Promise<Array<SeminarAttendee>> {
        return Axios.post(`${this.url}-create-multiple`, resources);
    }

    update(resource: SeminarAttendee): Promise<SeminarAttendee> {
        return Axios.put(`${this.url}`, resource)
    }

    delete(id: number): Promise<void> {
        return Axios.delete(`${this.url}/${id}`);
    }

    download(seminarId: number): string {
        return `${this.url}/download/docx/${seminarId}`;
    }

    changeStatus(ids: Array<number>, status: SeminarAttendeeStatusEnum): Promise<any> {
        return Axios.put(`${Configuration.apiUrl}/seminar-attendees-update-status?ids=${ids}&status=${status}`);
    }

    invite(invitationHtml: string, seminarId: number, profiles: Array<number>): Promise<void> {
        return Axios.post(`${this.url}/action/invite`, {
            invitationHtml,
            profiles,
            seminarId
        });
    }

    sendCertificate(invitationHtml: string, seminarId: number, profiles: Array<number>): Promise<void> {
        return Axios.post(`${this.url}/action/sendCertificate`, {
            invitationHtml,
            profiles,
            seminarId
        });
    }

    downloadCertificate(seminarId: number, profiles: Array<number>): Promise<ArrayBuffer> {
        return Axios.post(`${this.url}/action/downloadCertificates`, {
            profiles,
            seminarId
        }, {
            headers: {
                ContentType: "application/zip",
            },
            responseType: 'blob'
        });
    }

    downloadCertificates(seminarId: number, profiles: Array<number>): Promise<ArrayBuffer> {
        return Axios.post(`${this.url}/action/downloadCertificates`, {
            profiles,
            seminarId
        }, {
            headers: {
                ContentType: "application/zip",
            },
            responseType: 'blob'
        });
    }

    downloadInvitations(seminarId: number, profiles: Array<number>): Promise<ArrayBuffer> {
        return Axios.post(`${this.url}/action/downloadInvitations`, {
            profiles,
            seminarId
        }, {
            headers: {
                ContentType: "application/zip",
            },
            responseType: 'blob'
        });
    }
    downloadInvitationsSeminar(seminarId: number): Promise<ArrayBuffer> {
        return Axios.get(`${this.url}/action/downloadInvitationsSeminar/${seminarId}`, {
            headers: {
                ContentType: "application/zip",
            },
            responseType: 'blob'
        });
    }
    downloadCertificateForLecturers( profiles: Array<number>, seminarId:Array<number>,): Promise<ArrayBuffer> {
        return Axios.post(`${this.urlLecturers}/action/downloadCertificates`, {
            profiles,
            seminarId
        }, {
            headers: {
                ContentType: "application/zip",
            },
            responseType: 'blob'
        });
    }

    sendSurveyLink(seminarId: number, profiles: Array<number>): Promise<void> {
        return Axios.post(`${this.url}/action/sendSurveyLink`, {
            profiles,
            seminarId
        });
    }


}

export default SeminarAttendeeAPI;
