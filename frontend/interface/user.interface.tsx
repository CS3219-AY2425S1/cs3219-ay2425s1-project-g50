export interface User {
  id: string;
  username: string;
  email: string;
  skillLevel: string | null;
  isAdmin: boolean;
  createdAt: string;
}
