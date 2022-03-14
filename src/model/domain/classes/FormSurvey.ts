import { AbstractAuditingEntity } from "./AbstractAuditingEntity";
import {UserProfile} from "./UserProfile";

class FormSurvey extends AbstractAuditingEntity {
    name: any;
    description: any;
    estimatedTime: number = 0;
    pagination?:boolean;
    questions: any;
    lecturers?: UserProfile[];
}

export default FormSurvey;
