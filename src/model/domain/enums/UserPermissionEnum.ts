import { AdminPanelPermissionEnum } from "./AdminPanelPermissionEnum";
import { InternalPortalPermissionEnum } from "./InternalPortalPermissionEnum";

export enum GlobalPermissionEnum {
    ROLE_GENERAL = "ROLE_GENERAL",
    ROLE_INTERNAL_PORTAL = "ROLE_INTERNAL_PORTAL",
    ROLE_ADMIN_PANEL = "ROLE_ADMIN_PANEL",
}

export type UserPermissionEnum = GlobalPermissionEnum | AdminPanelPermissionEnum | InternalPortalPermissionEnum;