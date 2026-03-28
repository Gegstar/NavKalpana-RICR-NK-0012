import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';

export interface UserState {
  id: string | null;
  full_name: string;
  username: string;
  email: string;
  role: 'STUDENT' | 'SUPER_ADMIN' | 'ADMIN' | 'INSTRUCTOR' | null;
  auth_provider: string;
  profile_image: string | null;
  is_active: boolean;
  is_verified: boolean;
  business_unit_id: string | null;
}

const initialState: UserState = {
  id: null,
  full_name: '',
  username: '',
  email: '',
  role: null,
  auth_provider: 'LOCAL',
  profile_image: null,
  is_active: false,
  is_verified: false,
  business_unit_id: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Set full user (after login / fetch profile)
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      Object.assign(state, action.payload);
    },

    // Clear user (logout)
    clearUser: () => initialState,

    // Update profile (partial update)
    updateUser: (state, action: PayloadAction<Partial<UserState>>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { setUser, clearUser, updateUser } = userSlice.actions;

export default userSlice.reducer;