import { AbstractAuditingEntity } from './AbstractAuditingEntity';

export class ClassModule extends AbstractAuditingEntity {
  name: string = "New class module";
  description?: string;
}
