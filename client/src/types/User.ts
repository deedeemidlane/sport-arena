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

export const defaultUserValue: IUser = {
  id: 0,
  name: "",
  phone: "",
  email: "",
  role: "CUSTOMER",
  gender: "FEMALE",
  avatarUrl: "",
  verified: false,
  createdAt: "",
  updatedAt: "",
};
