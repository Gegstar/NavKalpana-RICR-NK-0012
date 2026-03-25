import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Doubt {
  id: number;
  courseId: number;
  topic: string;
  description: string;
  attachmentUrl?: string;
  createdAt: string;
  status: 'Pending' | 'Resolved';
}

export interface BackupClassRequest {
  id: number;
  courseId: number;
  topic: string;
  reason: string;
  createdAt: string;
}

interface LearningSupportState {
  doubts: Doubt[];
  backupRequests: BackupClassRequest[];
}

const initialState: LearningSupportState = {
  doubts: [],
  backupRequests: [],
};

const learningSupportSlice = createSlice({
  name: 'learningSupport',
  initialState,
  reducers: {
    submitDoubt: (state, action: PayloadAction<Omit<Doubt, 'id' | 'createdAt' | 'status'>>) => {
      state.doubts.push({
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        status: 'Pending',
      });
    },
    requestBackupClass: (state, action: PayloadAction<Omit<BackupClassRequest, 'id' | 'createdAt'>>) => {
      state.backupRequests.push({
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      });
    },
  },
});

export const { submitDoubt, requestBackupClass } = learningSupportSlice.actions;
export default learningSupportSlice.reducer;