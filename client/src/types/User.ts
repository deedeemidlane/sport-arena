export interface User {
  id: number;
  phone: string;
  role: "CUSTOMER" | "OWNER" | "ADMIN";
  name: string;
  avatarUrl: string;
  gender: string;
}
