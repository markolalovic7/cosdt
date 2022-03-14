import { BrowserFile } from "../../../shared/components/file-upload/FileUpload";
import { GenderEnum } from "../enums/GenderEnum";
import { UserPermissionEnum } from "../enums/UserPermissionEnum";
import { AbstractAuditingEntity } from "./AbstractAuditingEntity";
import { Institution } from "./Institution";
import { ProfileClass } from "./ProfileClass";
import { ProfileFunction } from "./ProfileFunction";

export class UserProfile extends AbstractAuditingEntity {
    username: string = '';
    email: string = '';
    firstName: string = '';
    lastName: string = '';
    imeOca: string = '';
    jmbg: string = '';
    adresa: string = '';
    realm: string = '';
    enabled?: boolean;
    telephoneNumber?: string;
    phonePrefix?: string;
    photo?: string | BrowserFile;
    isForeignLecturer?: boolean;
    seminarHours?: number;
    gender?: GenderEnum;
    function?: ProfileFunction;
    profileClasses?: Array<ProfileClass>;
    institution?: Institution;
    color?: string;
    roles: Array<UserPermissionEnum> = [];
}
