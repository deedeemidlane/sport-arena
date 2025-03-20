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

export const ConfirmDeleteAccountModal = ({
  open,
  setOpen,
  deleteUser,
  loading,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  deleteUser: () => void;
  loading: boolean;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Xác nhận xoá</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center my-4 gap-4">
          <div>
            <CircleAlert className="w-12 h-12" color="#99a1af" />
          </div>
          <div>
            <p>Bạn có chắc chắn muốn xoá tài khoản này?</p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => {
              setOpen(false);
            }}
          >
            Huỷ
          </Button>
          <Button onClick={deleteUser} disabled={loading}>
            {loading ? <Spinner /> : "Xoá"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
