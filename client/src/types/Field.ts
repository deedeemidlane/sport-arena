import { IOrder } from "./Order";
import { defaultUserValue, IUser } from "./User";

export interface IField {
  id: number;
  sportType: "FOOTBALL" | "PICKLEBALL" | "BADMINTON";
  name: string;
  numOfFields: number;
  ownerId: number;
  address: string;
  ward: string;
  district: string;
  province: string;
  pricePerHour: number;
  imageUrl?: string;
  description: string;
  createdAt: string;
  owner: IUser;
  accountNo: string;
  accountName: string;
  acqId: string;
  orders: IOrder[];
}

export const defaultFieldValue: IField = {
  id: 0,
  sportType: "FOOTBALL",
  name: "",
  numOfFields: 0,
  ownerId: 0,
  address: "",
  ward: "",
  district: "",
  province: "",
  pricePerHour: 0,
  imageUrl: "",
  description: "",
  createdAt: "",
  owner: defaultUserValue,
  accountNo: "",
  accountName: "",
  acqId: "",
  orders: [],
};
