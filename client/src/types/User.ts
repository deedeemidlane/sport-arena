export interface IUser {
  id: number;
  name: string;
  phone: string;
  email: string;
  role: "OWNER" | "CUSTOMER" | "ADMIN";
  gender: "MALE" | "FEMALE" | "OTHER";
  avatarUrl: string;
  verified: boolean;
  accountNo: string;
  accountName: string;
  acqId: string;
  frontIdCardImageUrl: string;
  backIdCardImageUrl: string;
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
  accountNo: "",
  accountName: "",
  acqId: "",
  frontIdCardImageUrl: "",
  backIdCardImageUrl: "",
  createdAt: "",
  updatedAt: "",
};
