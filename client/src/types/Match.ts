import { IMatchRequest, RequestStatus } from "./MatchRequest";

export interface IMatch {
  id: number;
  proofImageUrl?: string;
  opponentId: number;
  status: RequestStatus;
  matchRequest: IMatchRequest;
}
