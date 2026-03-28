// ===============================
// 👤 USER ROLE
// ===============================
export type UserRole =
  | 'STUDENT'
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'INSTRUCTOR';

// ===============================
// 👤 USER MODEL
// ===============================
export interface User {
  id: string;
  full_name: string;
  username: string;
  email: string;
  role: UserRole;
  auth_provider: 'LOCAL' | 'GOOGLE' | 'GITHUB';
  profile_image: string | null;
  is_active: boolean;
  is_verified: boolean;
  business_unit_id: string | null;
}

// ===============================
// 🛠️ OPTIONAL: UPDATE USER PAYLOAD
// ===============================
export type UpdateUserPayload = Partial<
  Omit<User, 'id' | 'auth_provider'>
>;

// ===============================
// 🔍 OPTIONAL: USER QUERY PARAMS (pagination)
// ===============================
export interface UserQueryParams {
  skip?: number;
  take?: number;
}