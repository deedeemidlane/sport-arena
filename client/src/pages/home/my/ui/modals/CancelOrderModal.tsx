import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CircleAlert } from "lucide-react";
import { Spinner } from "@/components/common";

export const CancelOrderModal = ({
  open,
  setOpen,
  cancelOrder,
  loading,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  cancelOrder: () => void;
  loading: boolean;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Xác nhận huỷ</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center my-4 gap-4">
          <div>
            <CircleAlert className="w-12 h-12" color="#99a1af" />
          </div>
          <div>
            <p>Bạn có chắc chắn muốn huỷ đơn đặt sân này?</p>
          </div>
        </div>
        <DialogFooter>
          {loading ? (
            <Button variant="outline" className="w-full" disabled>
              <Spinner />
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Quay lại
              </Button>
              <Button onClick={cancelOrder}>Xác nhận</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
