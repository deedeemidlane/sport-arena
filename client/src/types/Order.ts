import { IBooking } from "./Booking";
import { IField } from "./Field";
import { IUser } from "./User";

export interface IOrder {
  id: number;
  userId: number;
  sportFieldId: number;
  customerName: string;
  customerPhone: string;
  proofImageUrl: string;
  status: OrderStatus;
  createdAt: string;
  sportField: IField;
  bookings: IBooking[];
  user: IUser;
}

export type OrderStatus =
  | "CONFIRMED"
  | "PENDING"
  | "CANCELED"
  | "SELF_CANCELED"
  | "PROCESSING_REFUND"
  | "FINISHED";
