export interface IUser {
  id: number;
  name: string;
  phone: string;
  email: string;
  role: "OWNER" | "CUSTOMER";
  gender: "MALE" | "FEMALE" | "OTHER";
  avatarUrl: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}
