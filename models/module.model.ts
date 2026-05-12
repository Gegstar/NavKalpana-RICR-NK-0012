export interface Module {
  id: string;

  // RELATION
  courseId: string;

  // OPTIONAL UI DATA
  courseTitle?: string;

  // CORE FIELDS
  title: string;
  position: number;
  isPublished: boolean;



  // OPTIONAL COUNTS
  lessonsCount?: number;

  // TIMESTAMPS
  createdAt: string;
  updatedAt: string;
}