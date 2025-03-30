import { IBooking } from "./Booking";
import { IField } from "./Field";

export interface IOrder {
  id: number;
  userId: number;
  sportFieldId: number;
  customerName: string;
  customerPhone: string;
  proofImageUrl: string;
  status: "PENDING" | "CONFIRMED" | "CANCELED";
  createdAt: string;
  sportField: IField;
  bookings: IBooking[];
}
