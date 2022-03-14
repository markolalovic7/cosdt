import { AbstractAuditingEntity } from "./AbstractAuditingEntity";

export interface SeminarLecturer extends AbstractAuditingEntity {
    email: string;
    firstName: string;
    gender: string;
    lastName: string;
    username: string;
}