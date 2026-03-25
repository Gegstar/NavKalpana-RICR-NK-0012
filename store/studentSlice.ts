import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';

interface StudentState {
  name: string;
  email: string;
  avatar?: string;
  academicScore: number; // derived from courses
  learningStreak: number;
  lastStreakUpdate: string | null; // ISO date to track daily increment
}

const initialState: StudentState = {
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: '',
  academicScore: 85,
  learningStreak: 12,
  lastStreakUpdate: null,
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setStudent: (state, action: PayloadAction<Partial<StudentState>>) => {
      Object.assign(state, action.payload);
    },
    incrementStreak: (state) => {
      const today = new Date().toISOString().split('T')[0];
      if (state.lastStreakUpdate !== today) {
        state.learningStreak += 1;
        state.lastStreakUpdate = today;
      }
    },
    // The academic score will be computed via selector, not stored directly
  },
});

export const { setStudent, incrementStreak } = studentSlice.actions;

// Selector to compute academic score from courses progress
export const selectAcademicScore = createSelector(
  (state: RootState) => state.courses.enrolledCourses,
  (courses) => {
    if (courses.length === 0) return 0;
    const total = courses.reduce((sum, c) => sum + c.progress, 0);
    return Math.round(total / courses.length);
  }
);

export default studentSlice.reducer;