import { IUser } from "./User";

export interface IComplaint {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  user: IUser;
}
