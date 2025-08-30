export type UserRole = "admin" | "streamer" | "viewer";

export interface User {
  _id: string;
  username: string;
  email: string;
  google_id?: string;
  avatar_url?: string;
  display_name?: string;
  role: UserRole;
  is_active: boolean;
  last_login_at?: string;  
  createdAt: string;
  updatedAt: string;
}
