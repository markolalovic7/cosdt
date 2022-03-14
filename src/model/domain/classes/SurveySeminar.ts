import { AbstractAuditingEntity } from "./AbstractAuditingEntity";

class SurveySeminar extends AbstractAuditingEntity {
  name: any;
  description: any;
  estimatedTime: number = 0;
  pagination?:boolean;
  questions: any;
}

export default SurveySeminar;
