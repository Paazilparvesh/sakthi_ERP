export type UserRole = "role1" | "QA" | "product" | "Admin" | "accountent";

export interface User {
  username: string;
  role_type: UserRole;
  token?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    username: string,
    password: string,
    role_type: UserRole
  ) => Promise<boolean>;
  logout: () => void;
}
