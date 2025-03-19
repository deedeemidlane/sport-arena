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
  description: string;
  createdAt: string;
}
