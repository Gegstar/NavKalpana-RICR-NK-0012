import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import globalReducer from './globalSlice';
import userReducer from '@/store/userSlice'; // ✅ ADD THIS
import studentReducer from '@/store/studentSlice';
import coursesReducer from '@/store/coursesSlice';
import assignmentsReducer from '@/store/assignmentsSlice';
import quizzesReducer from '@/store/quizzesSlice';
import attendanceReducer from '@/store/attendanceSlice';
import learningSupportReducer from '@/store/learningSupportSlice';

export const store = configureStore({
  reducer: {
    global: globalReducer,
    user: userReducer, // REGISTER HERE
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

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;