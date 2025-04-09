import { IOrder } from "./Order";

export interface IBooking {
  id: number;
  orderId: number;
  fieldNo: number;
  bookingDate: string;
  startTime: number;
  price: number;
  createdAt: string;
  order: IOrder;
}
