import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Lesson {
  id: number;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  completed: boolean;
  videoUrl?: string;
  notes?: string;
  quiz?: any; // placeholder
  codeLab?: any;
}

export interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: number;
  title: string;
  instructor: string;
  thumbnail?: string;
  modules: Module[];
  progress: number;
  attendancePercentage?: number; // dummy for now
}

// Dummy data (you can expand)
const dummyCourses: Course[] = [
  {
    id: 1,
    title: 'Complete Web Development Bootcamp',
    instructor: 'Dr. Sarah Chen',
    modules: [
      {
        id: 1,
        title: 'Introduction',
        lessons: [
          { id: 1, title: 'What is Web Development?', difficulty: 'Beginner', completed: false },
          { id: 2, title: 'Setting up Environment', difficulty: 'Beginner', completed: false },
        ],
      },
      {
        id: 2,
        title: 'HTML & CSS',
        lessons: [
          { id: 3, title: 'HTML Basics', difficulty: 'Beginner', completed: false },
          { id: 4, title: 'CSS Fundamentals', difficulty: 'Beginner', completed: false },
        ],
      },
    ],
    progress: 0,
  },
  {
    id: 2,
    title: 'Data Science & Machine Learning',
    instructor: 'Prof. James Wilson',
    modules: [
      {
        id: 1,
        title: 'Python for Data Science',
        lessons: [
          { id: 5, title: 'Python Basics', difficulty: 'Beginner', completed: false },
          { id: 6, title: 'NumPy & Pandas', difficulty: 'Intermediate', completed: false },
        ],
      },
    ],
    progress: 0,
  },
  {
    id: 3,
    title: 'UI/UX Design Masterclass',
    instructor: 'Emily Rodriguez',
    modules: [
      {
        id: 1,
        title: 'Design Principles',
        lessons: [
          { id: 7, title: 'Color Theory', difficulty: 'Beginner', completed: false },
          { id: 8, title: 'Typography', difficulty: 'Beginner', completed: false },
        ],
      },
    ],
    progress: 0,
  },
];

interface CoursesState {
  enrolledCourses: Course[];
}

const initialState: CoursesState = {
  enrolledCourses: dummyCourses,
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    markLessonComplete: (state, action: PayloadAction<{ courseId: number; lessonId: number }>) => {
      const course = state.enrolledCourses.find(c => c.id === action.payload.courseId);
      if (!course) return;

      let totalLessons = 0;
      let completedLessons = 0;
      for (const module of course.modules) {
        for (const lesson of module.lessons) {
          totalLessons++;
          if (lesson.id === action.payload.lessonId && !lesson.completed) {
            lesson.completed = true;
          }
          if (lesson.completed) completedLessons++;
        }
      }
      course.progress = Math.round((completedLessons / totalLessons) * 100);
    },
    markCourseComplete: (state, action: PayloadAction<number>) => {
      const course = state.enrolledCourses.find(c => c.id === action.payload);
      if (!course) return;
      for (const module of course.modules) {
        for (const lesson of module.lessons) {
          lesson.completed = true;
        }
      }
      course.progress = 100;
    },
    // For demo: reset course progress (optional)
    resetCourse: (state, action: PayloadAction<number>) => {
      const course = state.enrolledCourses.find(c => c.id === action.payload);
      if (!course) return;
      for (const module of course.modules) {
        for (const lesson of module.lessons) {
          lesson.completed = false;
        }
      }
      course.progress = 0;
    },
  },
});

export const { markLessonComplete, markCourseComplete, resetCourse } = coursesSlice.actions;
export default coursesSlice.reducer;