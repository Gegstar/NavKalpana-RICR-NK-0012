export enum LessonResourceType {
  VIDEO = "VIDEO",
  PDF = "PDF",
  DOCUMENT = "DOCUMENT",
  IMAGE = "IMAGE",
  LINK = "LINK",
  QUIZ = "QUIZ",
  AUDIO = "AUDIO",
  ZIP = "ZIP",
  CODE = "CODE",
}

export interface LessonResourceMetadata {
  duration?: number;

  size?: number;

  mimeType?: string;

  thumbnailUrl?: string;

  fileName?: string;

  pages?: number;

  resolution?: string;

  language?: string;

  author?: string;

  externalProvider?: string;

  [key: string]: any;
}

export interface LessonResource {
  id: string;

  // =========================================================
  // RELATIONS
  // =========================================================

  lessonId: string;

  lessonTitle?: string;

  // =========================================================
  // CORE FIELDS
  // =========================================================

  resourceType: LessonResourceType;

  title: string;

  resourceUrl: string;

  position: number;

  // =========================================================
  // OPTIONAL UI DATA
  // =========================================================

  metadata?: LessonResourceMetadata;

  isCompleted?: boolean;

  progress?: number;

  isLocked?: boolean;

  // =========================================================
  // TIMESTAMPS
  // =========================================================

  createdAt: string;

  updatedAt: string;
}