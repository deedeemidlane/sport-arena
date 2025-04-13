import { IBooking } from "./Booking";
import { IUser } from "./User";

export interface IMatchRequest {
  id: number;
  userId: number;
  bookingId: number;
  desiredLevel: DesireLevel;
  status: RequestStatus;
  createdAt: string;
  booking: IBooking;
  user: IUser;
  match: {
    id: number;
    proofImageUrl?: string;
    opponent: IUser;
  }[];
}

export type DesireLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type RequestStatus =
  | "OPEN"
  | "REJECTED"
  | "PROCESSING_REQUEST"
  | "PROCESSING_PAYMENT"
  | "MATCHED"
  | "CLOSED";
