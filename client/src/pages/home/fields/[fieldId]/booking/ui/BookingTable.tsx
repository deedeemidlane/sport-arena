import { Dispatch, Fragment, SetStateAction, useMemo, useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/common/DatePicker";
import { ArrowLeft, Calendar } from "lucide-react";
import { formatHour, formatPriceInVND } from "@/utils/helperFunctions";
import { IField } from "@/types/Field";
import { IBookingSlot } from "../BookingPage";
import { getTimeIndex, TIME_SLOTS } from "@/constants/times";

interface BookingTableProps {
  field: IField;
  fieldId: string | undefined;
  bookingSlots: IBookingSlot[];
  setBookingSlots: Dispatch<SetStateAction<IBookingSlot[]>>;
  changeStep: (stepName: string) => void;
}

export const BookingTable = ({
  field,
  fieldId,
  bookingSlots,
  setBookingSlots,
  changeStep,
}: BookingTableProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const currentHour = useMemo(() => {
    if (selectedDate.toLocaleDateString() === new Date().toLocaleDateString()) {
      return new Date().getHours();
    }
    return 0;
  }, [selectedDate]);

  const handleSlotToggle = (
    fieldIndex: number,
    time: string,
    isSelected: boolean,
    price: number
  ) => {
    const updatedBookingSlots = [...bookingSlots];
    if (isSelected) {
      const selectedSlotIndex = updatedBookingSlots.findIndex(
        (slot) =>
          slot.date === selectedDate.toLocaleDateString() &&
          slot.fieldIndex === fieldIndex &&
          slot.time === time
      );
      updatedBookingSlots.splice(selectedSlotIndex, 1);
    } else {
      updatedBookingSlots.push({
        date: selectedDate.toLocaleDateString(),
        time,
        fieldIndex,
        price: price,
        selected: true,
        booked: false,
      });
    }

    setBookingSlots(updatedBookingSlots);
  };

  const handleSubmitBooking = () => {
    console.log("further handling: ", bookingSlots);
    changeStep("confirmation");
  };

  const numOfSelectedSlots = bookingSlots.filter(
    (slot) => slot.selected
  ).length;

  const getTotalPrice = () => {
    return bookingSlots
      .filter((slot) => slot.selected)
      .reduce((acc, slot) => acc + slot.price, 0);
  };

  return (
    <>
      <div className="flex-1 container mx-auto pb-6 pt-4 px-4">
        {/* Back button */}
        <div className="mb-4">
          <Link
            to={`/fields/${fieldId}`}
            className="inline-flex items-center sm:mb-4 text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Link>

          <h1 className="text-xl font-heading font-bold mb-4">{field.name}</h1>

          {/* Date selection and view toggle */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setSelectedDate(new Date())}
              className="hidden sm:block"
            >
              Hôm nay
            </Button>
            <DatePicker date={selectedDate} setDate={setSelectedDate} />
          </div>
        </div>

        <div className="max-h-[60vh] overflow-auto border mb-4">
          <table className="w-full border-collapse border-2">
            <thead>
              <tr>
                <th className="p-3 text-left sm:w-20 outline-2 -outline-offset-1 outline-gray-400 sticky top-0 left-0 bg-gray-300 z-10"></th>
                {Array.from({ length: field.numOfFields }, (_, i) => i + 1).map(
                  (fieldIndex) => (
                    <th
                      key={`fieldNo-${fieldIndex}`}
                      className=" outline-2 -outline-offset-1 outline-gray-400 p-3.5 text-center sticky top-0 bg-white"
                    >
                      Sân {fieldIndex}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {field.fieldTimes.map((fieldTime) => (
                <Fragment key={`fieldTime-${fieldTime.id}`}>
                  {TIME_SLOTS.slice(
                    TIME_SLOTS.indexOf(fieldTime.startTime),
                    TIME_SLOTS.indexOf(fieldTime.endTime)
                  )
                    .filter((time) => time > formatHour(currentHour))
                    .map((time) => (
                      <tr key={time}>
                        <td className="outline-2 -outline-offset-1 bg-white p-3 border-none text-center font-bold sticky left-0 sm:whitespace-nowrap max-sm:w-16">
                          {time} - {TIME_SLOTS[getTimeIndex(time) + 1]}
                        </td>
                        {Array.from(
                          { length: field.numOfFields },
                          (_, i) => i + 1
                        ).map((fieldIndex) => {
                          const slot = bookingSlots.find(
                            (s) =>
                              s.date === selectedDate.toLocaleDateString() &&
                              s.fieldIndex === fieldIndex &&
                              s.time === time
                          );
                          const isBooked = slot?.booked || false;
                          const isSelected = slot?.selected || false;

                          return (
                            <td
                              key={`${fieldIndex}-${time}`}
                              className="text-center border-2"
                            >
                              <button
                                className={`w-full p-3.5 max-sm:py-9 hover:bg-gray-100 text-sm ${
                                  isBooked
                                    ? "bg-gray-200 text-gray-500 hover:bg-gray-200 hover:text-gray-500 cursor-not-allowed"
                                    : isSelected
                                    ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800 cursor-pointer"
                                    : "cursor-pointer"
                                }`}
                                disabled={isBooked}
                                onClick={() =>
                                  handleSlotToggle(
                                    fieldIndex,
                                    time,
                                    isSelected,
                                    fieldTime.pricePerSlot
                                  )
                                }
                              >
                                {formatPriceInVND(fieldTime.pricePerSlot)}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Booking summary */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-gray-600">Đã chọn {numOfSelectedSlots} lịch</p>
            <p className="text-lg font-medium">
              Tổng tiền: {formatPriceInVND(getTotalPrice())}
            </p>
          </div>

          <Button
            size="lg"
            onClick={handleSubmitBooking}
            disabled={numOfSelectedSlots === 0}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Đặt sân
          </Button>
        </div>
      </div>
    </>
  );
};
