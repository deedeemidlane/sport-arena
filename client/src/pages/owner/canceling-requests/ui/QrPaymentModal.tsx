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
import { IUser } from "@/types/User";

export const QrPaymentModal = ({
  open,
  setOpen,
  price,
  customer,
  fieldName,
  loading,
  handleSubmit,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  price: number;
  customer: IUser;
  fieldName: string;
  loading: boolean;
  handleSubmit: () => void;
}) => {
  const [QRImageData, setQRImageData] = useState("");

  useEffect(() => {
    const generateQR = async () => {
      const values = {
        accountNo: customer.accountNo,
        accountName: customer.accountName,
        acqId: customer.acqId,
        addInfo: `Hoàn tiền đặt sân từ ${fieldName}`,
        amount: `${price}`,
        template: "print",
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

    if (customer) {
      generateQR();
    }
  }, [customer]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b">
          <DialogTitle>Hoàn tiền</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <h3 className="font-bold text-center">
          Quét QR để hoàn tiền cho khách hàng
        </h3>

        {QRImageData ? (
          <div className="flex flex-col items-center">
            <img src={QRImageData} alt="qrcode" className="w-10/12" />
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
