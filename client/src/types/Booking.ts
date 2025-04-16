import { IOrder } from "./Order";

export interface IBooking {
  id: number;
  orderId: number;
  fieldNo: number;
  bookingDate: string;
  startTime: string;
  price: number;
  createdAt: string;
  order: IOrder;
}
