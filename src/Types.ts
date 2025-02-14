export interface USER {
  username?: string;
  email?: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
  userType: "admin" | "user" | string;
  _id?: string;
  _v?: number;
}
