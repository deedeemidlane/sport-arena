import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DISPLAYED_SPORTS } from "@/constants/sports";
import { DISPLAYED_LEVELS } from "@/constants/levels";
import { formatDate, formatHour } from "@/utils/helperFunctions";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/common";
import { IMatchRequest } from "@/types/MatchRequest";

export const ConfirmAcceptRequestModal = ({
  selectedRequest,
  openAcceptModal,
  setOpenAcceptModal,
  acceptRequestLoading,
  acceptRequest,
}: {
  selectedRequest: IMatchRequest;
  openAcceptModal: boolean;
  setOpenAcceptModal: React.Dispatch<React.SetStateAction<boolean>>;
  acceptRequestLoading: boolean;
  acceptRequest: () => void;
}) => {
  const opponent = selectedRequest.match[0]?.opponent;

  return (
    <Dialog open={openAcceptModal} onOpenChange={setOpenAcceptModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận ghép cặp</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn chấp nhận yêu cầu ghép cặp này không?
          </DialogDescription>
        </DialogHeader>
        {opponent && (
          <div className="my-4">
            <p className="font-medium text-lg mb-2">Thông tin đối thủ</p>
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={opponent.avatarUrl} />
                <AvatarFallback>
                  {opponent.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{opponent.name}</p>
                <p className="text-sm text-gray-500">{opponent.phone}</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p>
                <strong>Môn thể thao:</strong>{" "}
                {
                  DISPLAYED_SPORTS[
                    selectedRequest.booking.order.sportField.sportType
                  ]
                }
              </p>
              <p>
                <strong>Trình độ:</strong>{" "}
                {DISPLAYED_LEVELS[selectedRequest.desiredLevel]}
              </p>
              <p>
                <strong>Sân đấu:</strong>{" "}
                {selectedRequest.booking.order.sportField.name}
              </p>
              <p>
                <strong>Thời gian:</strong>{" "}
                {formatHour(selectedRequest.booking.startTime)}
                {" ngày "}
                {formatDate(selectedRequest.booking.bookingDate)}
              </p>
            </div>
          </div>
        )}
        <DialogFooter>
          {acceptRequestLoading ? (
            <Button variant="outline" className="w-full" disabled>
              <Spinner />
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setOpenAcceptModal(false)}
              >
                Huỷ
              </Button>
              <Button onClick={acceptRequest}>Xác nhận</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
