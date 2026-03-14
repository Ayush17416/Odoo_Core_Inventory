export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url?: string | null;
  default_warehouse?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'inventory_manager' | 'warehouse_staff';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  full_name: string;
}

export interface AuthResponse {
  userId: string;
  email: string;
  full_name: string;
  role: 'inventory_manager' | 'warehouse_staff';
}

