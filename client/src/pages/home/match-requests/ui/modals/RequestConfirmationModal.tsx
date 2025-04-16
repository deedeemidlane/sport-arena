import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IMatchRequest } from "@/types/MatchRequest";
import { DISPLAYED_SPORTS } from "@/constants/sports";
import { DISPLAYED_LEVELS } from "@/constants/levels";
import { formatDate } from "@/utils/helperFunctions";
import { Spinner } from "@/components/common";

export const RequestConfirmationModal = ({
  request,
  isOpen,
  setIsOpen,
  loading,
  handleRequestMatch,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  request: IMatchRequest;
  loading: boolean;
  handleRequestMatch: () => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="[&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Xác nhận bắt cặp</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn bắt cặp với đối thủ này không?
          </DialogDescription>
        </DialogHeader>
        {request && request.user && (
          <div className="my-4">
            <p className="font-medium text-lg mb-2">Thông tin đối thủ</p>
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={request.user.avatarUrl} />
                <AvatarFallback>
                  {request.user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{request.user.name}</p>
                <p className="text-sm text-gray-500">{request.user.phone}</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p>
                <strong>Môn thể thao:</strong>{" "}
                {DISPLAYED_SPORTS[request.booking.order.sportField.sportType]}
              </p>
              <p>
                <strong>Trình độ:</strong>{" "}
                {DISPLAYED_LEVELS[request.desiredLevel]}
              </p>
              <p>
                <strong>Sân đấu:</strong>{" "}
                {request.booking.order.sportField.name}
              </p>
              <p>
                <strong>Thời gian:</strong> {request.booking.startTime}
                {" ngày "}
                {formatDate(request.booking.bookingDate)}
              </p>
            </div>
          </div>
        )}
        <DialogFooter>
          {loading ? (
            <Button variant="outline" className="w-full" disabled>
              <Spinner />
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Huỷ
              </Button>
              <Button onClick={handleRequestMatch} disabled={loading}>
                Xác nhận
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
