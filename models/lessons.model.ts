

export interface Lesson {
  id: string;

  // RELATION
  moduleId: string;
  moduleTitle:string;

  // CORE FIELDS
  title: string;
  position: number;
  isPreview: boolean;
  isPublished: boolean;

  // OPTIONAL UI DATA
  completed?: boolean;

  // TIMESTAMPS
  createdAt: string;
  updatedAt: string;
}
