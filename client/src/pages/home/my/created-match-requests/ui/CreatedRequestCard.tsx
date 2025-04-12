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
import { LevelBadge, StatusBadge } from "../../../utils/HelperComponents";
import { Activity, Calendar, Check, Clock, Eye, MapPin, X } from "lucide-react";
import { DISPLAYED_SPORTS } from "@/constants/sports";
import { formatDate, formatHour } from "@/utils/helperFunctions";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/common";

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
  const sportField = request.booking.order.sportField;
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
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-gray-500" />
            <div className="flex items-center gap-2">
              <span>{DISPLAYED_SPORTS[sportField.sportType]}</span>
              <LevelBadge level={request.desiredLevel} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div>
              <MapPin className="h-4 w-4 text-gray-500" />
            </div>
            <div>
              <a
                href={`/fields/${sportField.id}`}
                className="font-medium hover:text-blue-600"
              >
                {sportField.name}
              </a>
              <p className="text-sm text-gray-500">
                {sportField.address && `${sportField.address}, `}
                {sportField.ward}, {sportField.district}, {sportField.province}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
              <span>{formatDate(request.booking.bookingDate)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-gray-500 mr-2" />
              <span>{formatHour(request.booking.startTime)}</span>
            </div>
          </div>

          {request.match && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">Đối thủ:</p>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={request.match.opponent.avatarUrl} />
                  <AvatarFallback>
                    {request.match.opponent.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{request.match.opponent.name}</p>
                  <p className="text-sm text-gray-500">
                    {request.match.opponent.phone}
                  </p>
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
          {request.match.proofImageUrl && (
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
                      setImageUrl(request.match.proofImageUrl);
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
