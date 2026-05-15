export interface Course {
  id: string;

  // RELATIONS
  businessUnitId: string;
  instructorId?: string | null;

  // CORE FIELDS
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;

  price: number;
  currency: string;

  isFree: boolean;
  isPublished: boolean;
  isActive: boolean;

  // OPTIONAL UI DATA
  instructor?: {
    id: string;
    name?: string | null;
  } | null;


  // TIMESTAMPS
  createdAt: string;
  updatedAt: string;
}


export interface ViewCourse {
  id: string;

  title: string;

  description?: string | null;

  thumbnailUrl?: string | null;

  isFree: boolean;

  modules: ViewCourseModule[];

  createdAt: string;

  updatedAt: string;
}

// ======================================================
// MODULE
// ======================================================

export interface ViewCourseModule {
  id: string;

  courseId: string;

  title: string;

  position: number;

  isPublished: boolean;

  lessons: ViewCourseLesson[];

  createdAt: string;

  updatedAt: string;
}

// ======================================================
// LESSON
// ======================================================

export interface ViewCourseLesson {
  id: string;

  moduleId: string;

  title: string;

  position: number;

  isPreview: boolean;

  isPublished: boolean;

  resources: ViewLessonResource[];

  createdAt: string;

  updatedAt: string;
}

// ======================================================
// RESOURCE
// ======================================================

export interface ViewLessonResource {
  id: string;

  lessonId: string;

  resourceType:
    | 'VIDEO'
    | 'PDF'
    | 'FILE'
    | 'TEXT'
    | 'LINK'
    | 'IMAGE'
    | 'AUDIO'
    | 'ZIP';

  title: string;

  resourceUrl: string;

  metadata?: Record<string, any>;

  position: number;

  createdAt: string;

  updatedAt: string;
}