import { AbstractAuditingEntity } from "./AbstractAuditingEntity";
import { ClassTypeEnum } from "../enums/ClassTypeEnum";

export class Class extends AbstractAuditingEntity {
  name: string = 'New Class';
  description?: string;
  locked: boolean = false;
  type: ClassTypeEnum = ClassTypeEnum.SUDIJE
}
