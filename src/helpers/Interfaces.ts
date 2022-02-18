export interface ApiConfig { keyName: string, url: string, jwt: string, permisssions: RolePermissionInterface[] }
export type ApiListType = "AccessApi" | "MembershipApi" | "AttendanceApi" | "B1Api" | "GivingApi" | "LessonsApi";

export interface ApiInterface { name: string, keyName?: string, permissions: RolePermissionInterface[], jwt: string }
export interface ChurchAppInterface { id?: string, churchId?: string, appName?: string }
export interface ChurchInterface { id?: string, name?: string, registrationDate?: Date, apis?: ApiInterface[], address1?: string, address2?: string, city?: string, state?: string, zip?: string, country?: string, subDomain?: string, personId?: string, jwt?: string, settings?: GenericSettingInterface[] }
export interface GenericSettingInterface { id?: string, churchId?: string, keyName?: string, value?: string, public?: number }
export interface IPermission { api: string, contentType: string, action: string }
export interface RolePermissionInterface { id?: string, churchId?: string, roleId?: string, apiName?: string, contentType?: string, contentId?: string, action?: string }
