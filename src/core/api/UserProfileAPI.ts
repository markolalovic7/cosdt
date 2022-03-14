import Axios from "axios";
import { ProfileInstitutionHistory } from "../../model/domain/classes/ProfileInstitutionHistory";
import { SeminarFile } from "../../model/domain/classes/SeminarFile";
import { UserProfile } from "../../model/domain/classes/UserProfile";
import { UserSeminar } from "../../model/domain/classes/UserSeminar";
import { ApiParams } from "../../model/ui/types/ApiParams";
import { Configuration } from "../Configuration";

class UserProfileAPI {
    url: string = `${Configuration.apiUrl}/user-profiles`;
    profileUrl: string = `${Configuration.apiUrl}/profile`;

    getAll(params: ApiParams = {}): Promise<Array<UserProfile>> {
        return Axios.get(`${this.url}`, { params });
    }

    count(params: ApiParams): Promise<number> {
        return Axios.get(`${this.url}/count`, { params });
    }

    get(id: number): Promise<UserProfile> {
        return Axios.get(`${this.url}/${id}`)
    }

    update(resource: UserProfile): Promise<UserProfile> {
        return Axios.put(`${this.url}`, resource)
    }

    getUserProfile(): Promise<UserProfile> {
        return Axios.get(`${this.profileUrl}`)
    }

    getProfilePhotoUrl(url: string): string {
        return `${Configuration.baseUrl}${url}`
    }

    uploadPhoto(data: FormData): Promise<UserProfile> {
        return Axios.post(`${this.url}/image/upload`, data);
    }

    getInstitutionsHistory(id: number): Promise<Array<ProfileInstitutionHistory>> {
        return Axios.get(`${this.url}/${id}/InstitutionsHistory`)
    }

    getUserSeminars(id: number): Promise<Array<UserSeminar>> {
        return Axios.get(`${this.url}/${id}/seminars`)
    }

    getUserContracts(userId: number): Promise<Array<SeminarFile>> {
        return Axios.get(`${this.url}/${userId}/contracts`)
    }

    createUserContract(userId: number, data: FormData, query: ApiParams): Promise<SeminarFile> {
        const q = new URLSearchParams(query as any).toString();
        return Axios.post(`${this.url}/${userId}/contracts?${q}`, data)
    }
    downloadCertificate(invitationHtml: string, profileId: number, seminarIds: Array<number>, ): Promise<ArrayBuffer> {
        return Axios.post(`${this.url}/action/downloadCertificates`, {
            invitationHtml,
            profileId,
            seminarIds
        }, {
            headers: {
                ContentType: "application/zip",
            },
            responseType: 'blob'
        });
    }
    downloadCertificateForAttendees(profileId: number, seminarIds: Array<number>): Promise<ArrayBuffer> {
        return Axios.post(`${this.profileUrl}/action/downloadCertificates`, {
            profileId,
            seminarIds
        }, {
            headers: {
                ContentType: "application/zip",
            },
            responseType: 'blob'
        });
    }
}

export default UserProfileAPI;
