import { DesireLevel, IMatchRequest } from "@/types/MatchRequest";
import { Calendar, Clock, Dribbble, MapPin, User } from "lucide-react";
import { DISPLAYED_SPORTS } from "@/constants/sports";
import { formatDate } from "@/utils/helperFunctions";
import { Badge } from "../ui/badge";
import { DISPLAYED_GENDERS } from "@/constants/genders";

export const MatchRequestCardContent = ({
  request,
  showGender = true,
}: {
  request: IMatchRequest;
  showGender?: boolean;
}) => {
  const sportField = request.booking.order.sportField;
  return (
    <>
      {showGender && (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <div className="">{DISPLAYED_GENDERS[request.user.gender]}</div>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Dribbble className="h-4 w-4 text-gray-500" />
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
          <span>{request.booking.startTime}</span>
        </div>
      </div>
    </>
  );
};

const LevelBadge = ({ level }: { level: DesireLevel }) => {
  switch (level) {
    case "BEGINNER":
      return <Badge className="bg-emerald-500">Nghiệp dư</Badge>;
    case "INTERMEDIATE":
      return <Badge className="bg-amber-500">Trung cấp</Badge>;
    case "ADVANCED":
      return <Badge className="bg-red-500">Chuyên nghiệp</Badge>;
    default:
      return null;
  }
};
