import { configureStore } from '@reduxjs/toolkit';
import studentReducer from './studentSlice';
import coursesReducer from './coursesSlice';
import assignmentsReducer from './assignmentsSlice';
import quizzesReducer from './quizzesSlice';
import attendanceReducer from './attendanceSlice';
import learningSupportReducer from './learningSupportSlice';

export const store = configureStore({
  reducer: {
    student: studentReducer,
    courses: coursesReducer,
    assignments: assignmentsReducer,
    quizzes: quizzesReducer,
    attendance: attendanceReducer,
    learningSupport: learningSupportReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;