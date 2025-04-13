import { Badge } from "@/components/ui/badge";
import { DesireLevel, RequestStatus } from "@/types/MatchRequest";
import {
  CheckCircle,
  Circle,
  CircleDollarSign,
  RotateCcwIcon,
  X,
  XCircle,
} from "lucide-react";

// Helper function to render status badges with appropriate colors and icons
export const StatusBadge = ({ status }: { status: RequestStatus }) => {
  switch (status) {
    case "OPEN":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-600 border-blue-200"
        >
          <Circle className="w-3 h-3 mt-0.5 fill-blue-600 stroke-blue-600" />
          Đang mở
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-600 border-red-200"
        >
          <X className="w-3 h-3 mt-0.5 stroke-red-600" />
          Đã bị huỷ
        </Badge>
      );
    case "PROCESSING_REQUEST":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-600 border-yellow-200"
        >
          <RotateCcwIcon className="w-3 h-3 mt-0.5" />
          Chờ duyệt
        </Badge>
      );
    case "PROCESSING_PAYMENT":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-600 border-yellow-200"
        >
          <CircleDollarSign className="w-3 h-3 mt-0.5" />
          Chờ thanh toán
        </Badge>
      );
    case "MATCHED":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-600 border-green-200"
        >
          <CheckCircle className="w-3 h-3 mt-0.5 stroke-green-600" />
          Đã ghép
        </Badge>
      );
    case "CLOSED":
      return (
        <Badge
          variant="outline"
          className="bg-gray-50 text-gray-600 border-gray-200"
        >
          <XCircle className="w-3 h-3 mt-0.5 stroke-gray-600" />
          Đã đóng
        </Badge>
      );
    default:
      return null;
  }
};

// Helper function to render level badges with appropriate colors
export const LevelBadge = ({ level }: { level: DesireLevel }) => {
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
