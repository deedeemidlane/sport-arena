import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { IBookingSlot, ICustomerInfo } from "../BookingPage";
import { IField } from "@/types/Field";
import { formatDate, formatPriceInVND } from "@/utils/helperFunctions";
import { Dispatch, SetStateAction } from "react";

interface CustomerInfoProps {
  field: IField;
  bookingSlots: IBookingSlot[];
  changeStep: (stepName: string) => void;
  customerInfo: ICustomerInfo | undefined;
  setCustomerInfo: Dispatch<SetStateAction<ICustomerInfo | undefined>>;
}

export const CustomerInfo = ({
  field,
  bookingSlots,
  changeStep,
  customerInfo,
  setCustomerInfo,
}: CustomerInfoProps) => {
  const selectedSlots = bookingSlots.filter((slot) => slot.selected);
  const totalPrice = selectedSlots.length * field.pricePerHour;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICustomerInfo>({
    defaultValues: customerInfo,
  });

  const onSubmit = (data: ICustomerInfo) => {
    console.log(data);
    setCustomerInfo(data);
    changeStep("QR_payment");
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl text-center font-bold my-10">
        Xác nhận đặt sân tại <span className="text-red-400">{field.name}</span>
      </h1>
      <div className="lg:flex gap-20 pb-10">
        <div className="flex-1 rounded-lg border border-gray-200 bg-white/90 p-5 shadow max-lg:mb-10">
          <h2 className="text-xl font-bold mb-6">Thông tin sân</h2>
          <table className="w-full border-collapse border">
            <thead>
              <tr>
                <th className="border p-2">Ngày</th>
                <th className="border p-2">Thời gian</th>
                <th className="border p-2">Sân</th>
                <th className="border p-2">Giá</th>
              </tr>
            </thead>
            <tbody>
              {selectedSlots.map((slot, index) => (
                <tr key={`slot-${index}`}>
                  <td className="border p-2 text-center">
                    {formatDate(slot.date)}
                  </td>
                  <td className="border p-2 text-center">{slot.time}</td>
                  <td className="border p-2 text-center">
                    Sân {slot.fieldIndex}
                  </td>
                  <td className="border p-2 text-center">
                    {formatPriceInVND(field.pricePerHour)}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="border p-2 text-center font-bold" colSpan={3}>
                  Tổng tiền
                </td>
                <td className="border p-2 text-center">
                  {formatPriceInVND(totalPrice)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="m-auto sm:w-96 rounded-lg border border-gray-200 bg-white/90 p-5 shadow flex flex-col items-center">
          <h2 className="whitespace-nowrap text-xl font-bold my-3 mb-6">
            Thông tin người đặt
          </h2>

          <form
            className="flex max-w-md flex-col gap-6 w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Người đặt sân *</Label>
              <Input
                id="name"
                type="text"
                {...register("name", { required: true })}
                placeholder="Nhập tên người đặt sân"
                className={
                  errors.name &&
                  "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200"
                }
              />
              {errors.name && (
                <p className="text-sm text-red-500">
                  Vui lòng nhập tên người đặt sân
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Số điện thoại *</Label>
              <Input
                id="phone"
                type="text"
                {...register("phone", { required: true })}
                placeholder="Nhập số điện thoại"
                className={
                  errors.phone &&
                  "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200"
                }
              />
              {errors.phone && (
                <p className="text-sm text-red-500">
                  Vui lòng nhập số điện thoại
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Button className="w-full" type="submit">
                Xác nhận
              </Button>

              <Button
                className="w-full"
                variant="secondary"
                type="button"
                onClick={() => {
                  changeStep("select_slots");
                }}
              >
                Quay lại
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
