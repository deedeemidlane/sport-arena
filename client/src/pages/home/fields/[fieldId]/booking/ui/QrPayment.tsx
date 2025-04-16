import { Button } from "@/components/ui/button";
import { useState, useEffect, SetStateAction, Dispatch } from "react";
import { Spinner } from "@/components/common";
import { IField } from "@/types/Field";
import { IBookingSlot } from "../BookingPage";
import { Label } from "@/components/ui/label";

interface QrPaymentProps {
  field: IField;
  bookingSlots: IBookingSlot[];
  changeStep: (stepName: string) => void;
  proofImage: File | undefined;
  setProofImage: Dispatch<SetStateAction<File | undefined>>;
  loading: boolean;
  submitOrder: () => void;
}

export const QrPayment = ({
  field,
  bookingSlots,
  changeStep,
  proofImage,
  setProofImage,
  loading,
  submitOrder,
}: QrPaymentProps) => {
  const [QRImageData, setQRImageData] = useState("");

  useEffect(() => {
    const generateQR = async () => {
      const totalPrice = bookingSlots
        .filter((slot) => slot.selected)
        .reduce((acc, slot) => acc + slot.price, 0);

      const values = {
        accountNo: field.accountNo,
        accountName: field.accountName,
        acqId: field.acqId,
        addInfo: `Thanh toán hóa đơn từ ${field.name}`,
        amount: `${totalPrice}`,
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

    if (field) {
      generateQR();
    }
  }, [field]);

  return (
    <>
      {/* Main content */}
      <main className="mt-5 mb-10 md:mb-5">
        <div className="m-auto sm:w-[400px] rounded-lg border-gray-500 bg-white/90 p-5 sm:shadow-lg">
          <h1 className="text-center text-lg sm:text-3xl font-bold sm:my-3">
            Quét mã dưới đây để thực hiện thanh toán
          </h1>

          {QRImageData ? (
            <div className="flex flex-col items-center">
              <img src={QRImageData} alt="qrcode" className="w-full" />
              {/* <a href={QRImageData} download>
                <Button
                  variant="outline"
                  className="flex items-center"
                  disabled={loading}
                >
                  <span>
                    <Download className="h-5 w-5 mr-2" />
                  </span>
                  <span>Tải QR</span>
                </Button>
              </a> */}
              <div className="w-full my-3 px-4">
                <Label htmlFor="proofImage">Ảnh minh chứng chuyển khoản</Label>
                {/* {proofImage && (
                  <img
                    className="mt-1"
                    src={URL.createObjectURL(proofImage as Blob)}
                    alt=""
                  />
                )} */}
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

          <div className="flex flex-col gap-3 mt-3">
            {loading ? (
              <Button className="w-full" disabled>
                <Spinner />
              </Button>
            ) : (
              <>
                <Button
                  className="w-full"
                  disabled={!proofImage}
                  onClick={() => {
                    submitOrder();
                  }}
                >
                  Xác nhận thanh toán thành công
                </Button>

                <Button
                  className="w-full"
                  variant="secondary"
                  onClick={() => {
                    changeStep("confirmation");
                    setProofImage(undefined);
                  }}
                >
                  Quay lại
                </Button>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
};
