export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export type User = {
  email: string;
  firstName: string;
  lastName?: string;
  role: UserRole;
  avatar?: string;
};
