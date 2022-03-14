import {AbstractAuditingEntity} from "./AbstractAuditingEntity";
import FormSurvey from "./FormSurvey";

class SurveyStart extends AbstractAuditingEntity{
  examFormDefinition?: FormSurvey;
  maxTries?: number;
  minToPassExam?: number;
  noOfTries?: number;
  examInstanceId?: number;

}

export default SurveyStart
