import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/common";
import { Label } from "@/components/ui/label";
import { IUser } from "@/types/User";

export const QrPaymentModal = ({
  open,
  setOpen,
  price,
  creator,
  proofImage,
  setProofImage,
  loading,
  handleSubmit,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  price: number;
  creator: IUser;
  proofImage: File | undefined;
  setProofImage: Dispatch<SetStateAction<File | undefined>>;
  loading: boolean;
  handleSubmit: () => void;
}) => {
  const [QRImageData, setQRImageData] = useState("");

  useEffect(() => {
    const generateQR = async () => {
      const values = {
        accountNo: creator.accountNo,
        accountName: creator.accountName,
        acqId: creator.acqId,
        addInfo: `Thanh toán tiền cọc cho ${creator.name}`,
        amount: `${Math.floor(price / 2)}`,
        template: "compact2",
      };

      const res = await fetch("https://api.vietqr.io/v2/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": "e72fa13f-ca76-4957-b7c1-e080f368dcd8",
          "x-api-key": "0bffd4a8-daed-4f3c-8eb5-f70088f70aca",
        },
        body: JSON.stringify(values),
      });

      const resQR = await res.json();

      const qrDataURL = resQR.data;

      setQRImageData(qrDataURL["qrDataURL"]);
    };

    if (creator) {
      generateQR();
    }
  }, [creator]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b">
          <DialogTitle>Đặt cọc</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <h3 className="font-bold text-center">
          Bạn vui lòng đặt cọc tiền sân để hoàn thành ghép cặp đấu
        </h3>

        {QRImageData ? (
          <div className="flex flex-col items-center">
            <img src={QRImageData} alt="qrcode" className="w-10/12" />
            <div className="w-full my-3 px-4">
              <Label htmlFor="proofImage">Ảnh minh chứng chuyển khoản</Label>
              <input
                type="file"
                name="proofImage"
                id="proofImage"
                className="mt-1 w-full block text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => {
                  if (e.target.files) {
                    setProofImage(e.target.files[0]);
                  }
                }}
              />
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <Spinner />
          </div>
        )}
        <DialogFooter>
          {loading ? (
            <Button className="w-full" disabled>
              <Spinner />
            </Button>
          ) : (
            <div className="w-full">
              <Button
                className="w-full mb-1.5"
                disabled={!proofImage}
                onClick={() => {
                  handleSubmit();
                }}
              >
                Xác nhận thanh toán thành công
              </Button>

              <Button
                className="w-full"
                variant="secondary"
                onClick={() => {
                  setProofImage(undefined);
                  setOpen(false);
                }}
              >
                Huỷ
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
