import { Dispatch, SetStateAction } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IMatchRequest } from "@/types/MatchRequest";
import { StatusBadge } from "../../../utils/HelperComponents";
import { Check, Eye, Phone, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MatchRequestCardContent, Spinner } from "@/components/common";
import { DISPLAYED_GENDERS } from "@/constants/genders";

export const CreatedRequestCard = ({
  request,
  setSelectedRequest,
  setOpenAcceptModal,
  setOpenRejectModal,
  setImageUrl,
  setOpenImageModal,
  confirmDepositLoading,
  handleConfirmDeposit,
}: {
  request: IMatchRequest;
  setSelectedRequest: Dispatch<SetStateAction<IMatchRequest | undefined>>;
  setOpenAcceptModal: Dispatch<SetStateAction<boolean>>;
  setOpenRejectModal: Dispatch<SetStateAction<boolean>>;
  setImageUrl: Dispatch<SetStateAction<string | undefined>>;
  setOpenImageModal: Dispatch<SetStateAction<boolean>>;
  confirmDepositLoading: boolean;
  handleConfirmDeposit: (request: IMatchRequest) => void;
}) => {
  const opponent = request.match[0]?.opponent;
  return (
    <Card key={request.id} className="overflow-hidden">
      <CardHeader className="relative">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">Yêu cầu #{request.id}</CardTitle>
          <StatusBadge status={request.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <MatchRequestCardContent request={request} showGender={false} />

          {request.match.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">Đối thủ:</p>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={opponent.avatarUrl} />
                  <AvatarFallback>
                    {opponent.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{opponent.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {opponent.phone}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {DISPLAYED_GENDERS[opponent.gender]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      {request.status === "PROCESSING_REQUEST" && (
        <CardFooter className="pt-0 gap-2 flex-wrap">
          <Button
            className="flex-1"
            onClick={() => {
              setSelectedRequest(request);
              setOpenAcceptModal(true);
            }}
          >
            <Check className="h-4 w-4" /> Chấp nhận yêu cầu
          </Button>
          <Button
            variant={"outline"}
            className="flex-1"
            onClick={() => {
              setSelectedRequest(request);
              setOpenRejectModal(true);
            }}
          >
            <X className="h-4 w-4" /> Huỷ yêu cầu
          </Button>
        </CardFooter>
      )}
      {request.status === "PROCESSING_PAYMENT" && (
        <CardFooter className="pt-0">
          {request.match.length > 0 && (
            <>
              {confirmDepositLoading ? (
                <Button className="w-full" disabled>
                  <Spinner />
                </Button>
              ) : (
                <div>
                  <Button
                    variant="blue"
                    size="sm"
                    className="rounded-xs mb-2"
                    onClick={() => {
                      setImageUrl(request.match[0].proofImageUrl);
                      setOpenImageModal(true);
                    }}
                  >
                    <Eye />
                    Xem ảnh chuyển khoản tiền cọc
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => {
                      handleConfirmDeposit(request);
                    }}
                  >
                    <Check className="h-4 w-4" /> Xác nhận thanh toán
                  </Button>
                </div>
              )}
            </>
          )}
        </CardFooter>
      )}
    </Card>
  );
};
