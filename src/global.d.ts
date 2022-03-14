// Object id
type ObjectId = number;
//Generic record type for list views
type AnyRecord = { [key: string]: any };
//Foreign key by ID
type ForeignKeyId = { id: ObjectId | string; }
//HashMap
type CustomMap = { [key: string]: any };
//Generic url parameter for detailed view
type DetailsParams = { id: string; parentId: string }
type SeminarParams = { id: string, seminarId: string, seminarName: string, tab: string }
type ClassParams = { id: string, classId: string, className: string, tab: string }
type ExamParams = { id: string, examId: string, examName: string, tab: string }
type UserProfileParams = { id: string, userName: string, contractId: string, lectureId: string, tab: string }
type TemplateParams = { title: string; description: string }
