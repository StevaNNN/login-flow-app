export interface USER {
  userName?: string;
  fullName?: string;
  email?: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
  role: "admin" | "user" | string;
  _id?: string;
  _v?: number;
}
