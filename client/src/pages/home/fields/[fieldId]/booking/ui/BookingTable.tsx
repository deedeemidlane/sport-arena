import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/common/DatePicker";
import { ArrowLeft, Calendar } from "lucide-react";
import {
  formatDate,
  formatHour,
  formatPriceInVND,
} from "@/utils/helperFunctions";
import { IField } from "@/types/Field";
import { IBookingSlot } from "../BookingPage";

// Generate time slots from 5:00 to 23:00
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 5; hour < 23; hour++) {
    slots.push(hour);
  }
  return slots;
};

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

  const timeSlots = useMemo(() => {
    if (selectedDate.toLocaleDateString() === new Date().toLocaleDateString()) {
      const currentHour = new Date().getHours();
      if (currentHour >= 5) {
        return generateTimeSlots().slice(currentHour - 5 + 1);
      }
    }
    return generateTimeSlots();
  }, [selectedDate]);

  const handleSlotToggle = (
    fieldIndex: number,
    time: number,
    isSelected: boolean
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
        price: field.pricePerHour,
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
    return field ? numOfSelectedSlots * field.pricePerHour : 0;
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

        {/* Booking table */}
        <div className="h-[70vh] overflow-auto border mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="">
                <th className="border p-3 text-left w-20"></th>
                <th className="border border-r-2 p-3 text-center w-30">Sân</th>
                <th className="border p-3 text-center">
                  {formatDate(selectedDate.toString())}
                </th>
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time) => (
                <tr key={time}>
                  <td className="border p-3 text-center font-semibold text-gray-600">
                    {formatHour(time)}
                  </td>
                  <td className="p-0" colSpan={8}>
                    <table className="w-full border-collapse">
                      <tbody>
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
                            <tr key={`${fieldIndex}-${time}`}>
                              <td className="border border-l-0 w-30 p-3 text-center">
                                Sân {fieldIndex}
                              </td>
                              <td className="border text-center">
                                <button
                                  className={`w-full p-3 hover:bg-gray-100 ${
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
                                      isSelected
                                    )
                                  }
                                >
                                  {formatPriceInVND(field.pricePerHour)}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Booking summary */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
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
