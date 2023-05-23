export interface ApiConfig { keyName: string, url: string, jwt: string, permisssions: RolePermissionInterface[] }
export type ApiListType = "MembershipApi" | "AttendanceApi" | "GivingApi" | "LessonsApi";

export interface ApiInterface { name: string, keyName?: string, permissions: RolePermissionInterface[], jwt: string }
export interface ChurchAppInterface { id?: string, churchId?: string, appName?: string }
export interface ChurchInterface { id?: string, name?: string, registrationDate?: Date, apis?: ApiInterface[], address1?: string, address2?: string, city?: string, state?: string, zip?: string, country?: string, subDomain?: string, settings?: GenericSettingInterface[] }
export interface GenericSettingInterface { id?: string, churchId?: string, keyName?: string, value?: string, public?: number }
export interface IPermission { api: string, contentType: string, action: string }
export interface RolePermissionInterface { id?: string, churchId?: string, roleId?: string, apiName?: string, contentType?: string, contentId?: string, action?: string }

export interface ClassroomInterface { id?: string; churchId?: string; name?: string; }

export interface PlaylistInterface { lessonName: string, lessonTitle: string, lessonImage:string, lessonDescription:string, venueName: string, messages: PlaylistMessageInterface[] }
export interface PlaylistMessageInterface { name: string, files: PlaylistFileInterface[] }
export interface PlaylistFileInterface { name: string, url: string, seconds: number, loopVideo: boolean }

export interface ProgramInterface { id?: string, churchId?: string, providerId?: string, name?: string, slug?: string, image?: string, shortDescription?: string, description?: string, videoEmbedUrl: string, live?: boolean, aboutSection?: string }
export interface StudyInterface { id?: string, churchId?: string, programId?: string, name?: string, slug?: string, image?: string, shortDescription?: string, description?: string, videoEmbedUrl?: string, sort?: number, live?: boolean}
export interface LessonInterface { id?: string, churchId?: string, studyId?: string, name?: string, slug?: string, title?: string, sort?: number, image?: string, live?: boolean, description?: string, videoEmbedUrl?: string }
export interface VenueInterface { id?: string, churchId?: string, lessonId?: string, name?: string, sort?: number }
