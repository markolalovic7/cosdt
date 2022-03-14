import Axios from "axios";
import { FileUpload } from "../../model/domain/classes/FileUpload";
import { Report } from "../../model/domain/classes/Report";
import { Configuration } from "../Configuration";

class ReportAPI {
    url: string = `${Configuration.apiUrl}/report-birt`;
    seminarUrl: string = `${Configuration.apiUrl}/seminar-reports/`;
    journalOfInitalCandidatesUrl: string = `${Configuration.apiUrl}/the-journal-of-initial-candidates-reports/`;

    getAll(): Promise<Array<Report>> {
        return Axios.get(`${this.url}`);
    }

    get(id: number): Promise<Report> {
        return Axios.get(`${this.url}/${id}`);
    }
    // name, description, file
    create(data: FormData): Promise<Report> {
        return Axios.post(`${this.url}`, data);
    }

    delete(id: number): Promise<void> {
        return Axios.delete(`${this.url}/${id}`);
    }

    getFileUrl(file: FileUpload): string {
        return `${Configuration.baseUrl}${file.path}`;
    }

    getReportsUrl(id: number): string {
        return `${Configuration.baseUrl}/reports/report/${id}`;
    }
    getSeminarReportByYear(year: string): Promise<any> {
        return Axios.get(`${this.seminarUrl}download/xlsx/${year}`, {
            headers: {
                ContentType: "application/zip",
            },
            responseType: 'blob'
        });
    }
    getJournalReportByYear(year: string): Promise<any> {
        return Axios.get(`${this.journalOfInitalCandidatesUrl}download/xlsx/${year}`, {
            headers: {
                ContentType: "application/zip",
            },
            responseType: 'blob'
        });
    }
}

export default ReportAPI;
