import { IMatchRequest } from "@/types/MatchRequest";
import { MapPin, Calendar, Clock, Activity, HandCoins } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DISPLAYED_SPORTS } from "@/constants/sports";
import { formatDate, formatHour } from "@/utils/helperFunctions";
import { LevelBadge, StatusBadge } from "../../../utils/HelperComponents";
import { Dispatch, SetStateAction } from "react";

export const SendedRequestCard = ({
  request,
  setSelectedRequest,
  setOpenQrPaymentModal,
}: {
  request: IMatchRequest;
  setSelectedRequest: Dispatch<SetStateAction<IMatchRequest | undefined>>;
  setOpenQrPaymentModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const sportField = request.booking.order.sportField;
  return (
    <Card key={request.id} className="overflow-hidden">
      <CardHeader className="relative">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={request.user.avatarUrl || ""} />
              <AvatarFallback>
                {request.user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{request.user.name}</CardTitle>
              <p className="text-sm text-gray-500">{request.user.phone}</p>
            </div>
          </div>
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
              <Clock className="h-4 w-4 text-gray-500 mx-2" />
              <span>{formatHour(request.booking.startTime)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      {request.status === "PROCESSING_PAYMENT" && (
        <CardFooter className="pt-0">
          {request.match.proofImageUrl ? (
            <p className="text-green-600 font-semibold italic">
              Bạn đã thanh toán tiền cọc. Vui lòng chờ đối thủ xác nhận
            </p>
          ) : (
            <Button
              className="w-full"
              onClick={() => {
                setSelectedRequest(request);
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
