import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AttendanceRecord {
  date: string;
  status: 'Present' | 'Absent';
  courseId: number;
}

interface AttendanceState {
  records: AttendanceRecord[];
}

const dummyRecords: AttendanceRecord[] = [
  { date: '2025-03-01', status: 'Present', courseId: 1 },
  { date: '2025-03-02', status: 'Present', courseId: 1 },
  { date: '2025-03-03', status: 'Absent', courseId: 1 },
  // ... more
];

const initialState: AttendanceState = {
  records: dummyRecords,
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    // For now, we just have dummy data. No real actions needed.
  },
});

export default attendanceSlice.reducer;