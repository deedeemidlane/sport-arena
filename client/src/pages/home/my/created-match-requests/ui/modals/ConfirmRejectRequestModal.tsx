import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IMatchRequest } from "@/types/MatchRequest";
import { Spinner } from "@/components/common";

export const ConfirmRejectRequestModal = ({
  selectedRequest,
  openRejectModal,
  setOpenRejectModal,
  rejectRequestLoading,
  rejectRequest,
}: {
  selectedRequest: IMatchRequest;
  openRejectModal: boolean;
  setOpenRejectModal: React.Dispatch<React.SetStateAction<boolean>>;
  rejectRequestLoading: boolean;
  rejectRequest: () => void;
}) => {
  const opponent = selectedRequest.match[0]?.opponent;

  return (
    <Dialog open={openRejectModal} onOpenChange={setOpenRejectModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận huỷ</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {opponent && (
          <div className="mt-4">
            <p className="mb-2 text-center">
              Bạn có chắc chắn muốn huỷ yêu cầu ghép cặp từ đối thủ này không?
            </p>
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
          </div>
        )}

        <DialogFooter>
          {rejectRequestLoading ? (
            <Button variant="outline" className="w-full" disabled>
              <Spinner />
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setOpenRejectModal(false)}
              >
                Huỷ
              </Button>
              <Button onClick={rejectRequest}>Xác nhận</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
