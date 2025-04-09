import { IBooking } from "./Booking";
import { IUser } from "./User";

export interface IMatchRequest {
  id: number;
  userId: number;
  bookingId: number;
  desiredLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  status: "OPEN" | "MATCHED" | "CLOSED";
  createdAt: string;
  booking: IBooking;
  user: IUser;
}
