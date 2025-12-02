export interface ChurchInterface {
  id?: string;
  name?: string;
  subDomain?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  logoSquare?: string;
}

export interface ClassroomInterface {
  id?: string;
  churchId?: string;
  name?: string;
  lessonId?: string;
}

export interface ProgramInterface {
  id?: string;
  name?: string;
  slug?: string;
  image?: string;
  shortDescription?: string;
  description?: string;
  videoEmbedUrl?: string;
  live?: boolean;
  aboutSection?: string;
}

export interface StudyInterface {
  id?: string;
  programId?: string;
  name?: string;
  slug?: string;
  image?: string;
  shortDescription?: string;
  description?: string;
  videoEmbedUrl?: string;
  live?: boolean;
  sort?: number;
}

export interface LessonInterface {
  id?: string;
  studyId?: string;
  name?: string;
  slug?: string;
  title?: string;
  image?: string;
  description?: string;
  live?: boolean;
  sort?: number;
  videoEmbedUrl?: string;
}

export interface VenueInterface {
  id?: string;
  lessonId?: string;
  name?: string;
  sort?: number;
}

export interface LessonPlaylistInterface {
  id?: string;
  lessonId?: string;
  venueId?: string;
  messages?: LessonPlaylistMessageInterface[];
  lessonName?: string;
  lessonTitle?: string;
  lessonDescription?: string;
  lessonImage?: string;
}

export interface LessonPlaylistMessageInterface {
  id?: string;
  playlistId?: string;
  name?: string;
  sort?: number;
  files?: LessonPlaylistFileInterface[];
}

export interface LessonPlaylistFileInterface {
  id?: string;
  messageId?: string;
  name?: string;
  url?: string;
  seconds?: number;
  fileType?: string;
  sort?: number;
  loop?: boolean;
  loopVideo?: boolean;
}
