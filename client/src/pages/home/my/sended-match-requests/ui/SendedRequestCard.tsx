import { HandCoins } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "../../../utils/HelperComponents";
import { Dispatch, SetStateAction } from "react";
import { IMatch } from "@/types/Match";
import { MatchRequestCardContent } from "@/components/common";

export const SendedRequestCard = ({
  requestedMatch,
  setSelectedMatch,
  setOpenQrPaymentModal,
}: {
  requestedMatch: IMatch;
  setSelectedMatch: Dispatch<SetStateAction<IMatch | undefined>>;
  setOpenQrPaymentModal: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Card key={requestedMatch.id} className="overflow-hidden">
      <CardHeader className="relative">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={requestedMatch.matchRequest.user.avatarUrl || ""}
              />
              <AvatarFallback>
                {requestedMatch.matchRequest.user.name
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">
                {requestedMatch.matchRequest.user.name}
              </CardTitle>
              <p className="text-sm text-gray-500">
                {requestedMatch.matchRequest.user.phone}
              </p>
            </div>
          </div>
          <StatusBadge status={requestedMatch.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <MatchRequestCardContent request={requestedMatch.matchRequest} />
        </div>
      </CardContent>
      {requestedMatch.status === "PROCESSING_PAYMENT" && (
        <CardFooter className="pt-0">
          {requestedMatch.proofImageUrl ? (
            <p className="text-green-600 font-semibold italic">
              Bạn đã thanh toán tiền cọc. Vui lòng chờ đối thủ xác nhận
            </p>
          ) : (
            <Button
              className="w-full"
              onClick={() => {
                setSelectedMatch(requestedMatch);
                setOpenQrPaymentModal(true);
              }}
            >
              <HandCoins className="h-4 w-4" /> Thanh toán tiền cọc
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};
