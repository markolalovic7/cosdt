import { AbstractAuditingEntity } from './AbstractAuditingEntity';
import { Class } from './Class';
import { ClassAttendee } from './ClassAttendee';
import { ClassLectureInstance } from './ClassLectureInstance';
import { ClassModule } from './ClassModule';
import { UserProfile } from './UserProfile';

export class ClassLecture extends AbstractAuditingEntity {
  name: string = "New class lecture";
  description?: string;
  module?: ClassModule;
  klass?: ForeignKeyId | Class;
  secondsBefore: number = 300;
  classLecturers: Array<UserProfile> = [];
  classAttendees: Array<ClassAttendee> = [];
  classLectureInstances: Array<ClassLectureInstance> = [
    new ClassLectureInstance()
  ];
}
