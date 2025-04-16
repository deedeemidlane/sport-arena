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
  googleMapLink: string;
  minPrice: number;
  maxPrice: number;
  imageUrl?: string;
  description: string;
  createdAt: string;
  owner: IUser;
  accountNo: string;
  accountName: string;
  acqId: string;
  orders: IOrder[];
  services: {
    name: string;
    price: number;
  }[];
  fieldTimes: {
    id: number;
    startTime: string;
    endTime: string;
    pricePerSlot: number;
  }[];
}

export interface IService {
  name?: string;
  price?: string;
}

export interface IFieldTime {
  startTime: string;
  endTime: string;
  pricePerSlot: string;
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
  googleMapLink: "",
  minPrice: 0,
  maxPrice: 0,
  imageUrl: "",
  description: "",
  createdAt: "",
  owner: defaultUserValue,
  accountNo: "",
  accountName: "",
  acqId: "",
  orders: [],
  services: [],
  fieldTimes: [],
};
