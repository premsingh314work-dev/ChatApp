export interface AuthUser {
  _id: string;
  fullName: string;
  email: string;
  avatar: string | null;
  phone: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthFormData {
  email: string;
  password: string;
}

export interface SignupFormData extends AuthFormData {
  fullName: string;
}

export interface UpdateProfileData {
  // Matches the user's MongoDB schema.
  avatar: string;
}

export interface AuthResponse {
  data: AuthUser;
  message?: string;
}
