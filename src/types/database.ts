// Adapted from Supabase types for MySQL

export type AppRole = "inventory_manager" | "warehouse_staff";

export interface Profile {
  full_name: string;
  default_warehouse: string | null;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: AppRole;
}

