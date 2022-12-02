export interface ApiConfig { keyName: string, url: string, jwt: string, permisssions: RolePermissionInterface[] }
export type ApiListType = "MembershipApi" | "AttendanceApi" | "B1Api" | "GivingApi" | "LessonsApi";

export interface ApiInterface { name: string, keyName?: string, permissions: RolePermissionInterface[], jwt: string }
export interface ChurchAppInterface { id?: string, churchId?: string, appName?: string }
export interface ChurchInterface { id?: string, name?: string, registrationDate?: Date, apis?: ApiInterface[], address1?: string, address2?: string, city?: string, state?: string, zip?: string, country?: string, subDomain?: string, settings?: GenericSettingInterface[] }
export interface GenericSettingInterface { id?: string, churchId?: string, keyName?: string, value?: string, public?: number }
export interface IPermission { api: string, contentType: string, action: string }
export interface RolePermissionInterface { id?: string, churchId?: string, roleId?: string, apiName?: string, contentType?: string, contentId?: string, action?: string }

export interface ClassroomInterface { id?: string; churchId?: string; name?: string; }

export interface PlaylistInterface { lessonName: string, lessonTitle: string, venueName: string, messages: PlaylistMessageInterface[] }
export interface PlaylistMessageInterface { name: string, files: PlaylistFileInterface[] }
export interface PlaylistFileInterface { name: string, url: string, seconds: number, loopVideo: boolean }