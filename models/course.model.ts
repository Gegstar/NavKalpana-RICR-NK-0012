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

  modules?: CourseModule[];

  // TIMESTAMPS
  createdAt: string;
  updatedAt: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description?: string | null;
  lessons?: CourseLesson[];
}

export interface CourseLesson {
  id: string;
  title: string;
  description?: string | null;
  completed?: boolean;
}