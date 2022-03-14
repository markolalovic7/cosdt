import { Moment } from 'moment';
import { AbstractAuditingEntity } from './AbstractAuditingEntity';
import { ExamCategory } from './ExamCategory';
import { ExamSubcategory } from './ExamSubcategory';
import FormSurvey from "./FormSurvey";

export class Exam extends AbstractAuditingEntity {
    name: string = '';
    description?: string;
    start?: string;
    end?: string;
    jsonData?: string;
    maxTries: number = 0;
    minToPassExam: number = 0;
    survey?: FormSurvey;
    surveyId: number = 0;
    category?: ExamCategory;
    subcategory?: ExamSubcategory;
    active: boolean = false;

    //Exists only on UI for RangePicker
    range: Array<Moment> = [];
}
